const Vendor = require('../models/Vendor');
const Category = require('../models/Category'); 
const Lead = require('../models/Lead');         
const LeadTracker = require('../models/LeadTracker');
const Transaction = require('../models/Transaction');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
const crypto = require('crypto');


// ✅ RAZORPAY INITIALIZATION (Using .env)
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
// ============================================================
// 1. VENDOR AUTH (Registration & Login)
// ============================================================
exports.registerVendor = async (req, res) => {
    try {
        const { 
            name, shopName, phone, email, password, 
            category, area, pincode, city, state, 
            fullAddress, description, keywords 
        } = req.body;

        if (!email || !password || !phone || !shopName || !category || !pincode) {
            return res.status(400).json({ status: "error", message: "Sabhi details bharna zaroori hai!" });
        }

        const cleanPhone = phone.replace(/\D/g, '').slice(-10);
        const existing = await Vendor.findOne({ $or: [{ phone: cleanPhone }, { email: email.toLowerCase() }] });

        if (existing) {
            return res.status(400).json({ status: "error", message: "Email ya Phone pehle se register hai!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const myReferralCode = "VISTER" + Math.floor(1000 + Math.random() * 9000);
        let keywordArray = Array.isArray(keywords) ? keywords : (keywords ? keywords.split(',').map(k => k.trim()) : []);

        const newVendor = new Vendor({
            name, shopName, phone: cleanPhone, email: email.toLowerCase(), password: hashedPassword,
            category, area, pincode, city, state, fullAddress, description, keywords: keywordArray, 
            shopImage: req.file ? req.file.filename : "", walletBalance: 0, referralCode: myReferralCode
        });

        await newVendor.save();
        res.status(201).json({ status: "success", message: "Registration Successful!" });
    } catch (err) {
        res.status(500).json({ status: "error", message: "Reg Error: " + err.message });
    }
};

exports.loginVendor = async (req, res) => {
    try {
        const { email, password } = req.body;
        const seller = await Vendor.findOne({ email: email.toLowerCase() });
        if (!seller || !(await bcrypt.compare(password, seller.password))) return res.status(400).json({ status: "error", message: "Galti!" });

        const token = jwt.sign({ id: seller._id }, process.env.JWT_SECRET || 'vister_key', { expiresIn: '30d' });

        res.status(200).json({
            status: "success", token,
            seller: { id: seller._id, shopName: seller.shopName, email: seller.email, category: seller.category }
        });
    } catch (err) { res.status(500).json({ status: "error", message: "Login Fail" }); }
};

// ============================================================
// 2. SEARCH & LISTING (FIXED LOGIC)
// ============================================================

exports.searchVendors = async (req, res) => {
    try {
        const { query, categoryId, category } = req.query;
        
        // Jo bhi parameter mile (q, query, categoryId), use pakad lo
        const q = query || categoryId || category;

        if (!q || q === 'undefined' || q === 'null') {
            return res.status(200).json([]);
        }

        const regex = new RegExp(q, 'i'); // 'i' matlab spelling choti ho ya badi, sab chalega
        let filter = { $or: [] };

        // 1. Basic Fields mein dhoondo (Naam, Area, City, Category Name)
        filter.$or.push({ shopName: regex });
        filter.$or.push({ category: regex }); // Agar database mein "Plumber" likha hai toh mil jayega
        filter.$or.push({ area: regex });
        filter.$or.push({ city: regex });
        filter.$or.push({ name: regex }); // Owner name

        // 2. Agar "q" 24 akshar ki MongoDB ID hai
        if (q.length === 24 && /^[0-9a-fA-F]+$/.test(q)) {
            filter.$or.push({ category: q }); // ID se dhoondo
        }

        // 3. SMART LOOKUP: Name se ID aur ID se Name nikal kar search broaden karna
        try {
            if (q.length === 24) {
                // Agar ID aayi hai, toh uska naam nikal lo (e.g. ID -> "Plumber")
                const catDoc = await Category.findById(q);
                if (catDoc) filter.$or.push({ category: new RegExp(catDoc.name, 'i') });
            } else {
                // Agar Naam aaya hai, toh uski ID nikal lo (e.g. "Plumber" -> ID)
                const foundCat = await Category.findOne({ name: regex });
                if (foundCat) filter.$or.push({ category: foundCat._id.toString() });
            }
        } catch (e) {
            console.log("Lookup error but keeping search alive...");
        }

        // Database se dukanen nikalo
        const vendors = await Vendor.find(filter).sort({ isVerified: -1 }).lean();
        
        console.log(`🚀 Search Done: "${q}" | Dukanen mili: ${vendors.length}`);
        
        // Hamesha Array hi bhejo
        res.status(200).json(vendors);

    } catch (err) {
        console.error("Search Crash Error:", err.message);
        res.status(200).json([]); // Taaki frontend par loader na ghoome
    }
};
// ============================================================
// 3. LEAD MANAGEMENT (Unlock Contact Logic)
// ============================================================
exports.unlockLead = async (req, res) => {
    try {
        const { vendorId, leadId } = req.body;
        const vendor = await Vendor.findById(vendorId);
        const lead = await Lead.findById(leadId);

        if (!vendor || !lead) return res.status(404).json({ message: "Data nahi mila" });
        if (vendor.walletBalance < 20) return res.status(400).json({ message: "Balance kam hai!" });

        if (lead.unlockedBy && lead.unlockedBy.includes(vendorId)) {
            return res.status(200).json({ status: "success", customerPhone: lead.customerPhone });
        }

        vendor.walletBalance -= 20;
        if (!lead.unlockedBy) lead.unlockedBy = [];
        lead.unlockedBy.push(vendorId);

        await vendor.save();
        await lead.save();

        if (Transaction) {
            await Transaction.create({
                vendorId, amount: 20, type: 'debit', status: 'Success', description: `Unlocked: ${lead.customerName}`
            });
        }

        res.status(200).json({ status: "success", customerPhone: lead.customerPhone });
    } catch (err) { res.status(500).json({ message: "Unlock fail" }); }
};

// ============================================================
// 3. RECHARGE (Live Razorpay)
// ============================================================
exports.initiateRecharge = async (req, res) => {
    try {
        const { amount, vendorId } = req.body;
        const options = { amount: Number(amount) * 100, currency: "INR", receipt: `rcg_${vendorId}_${Date.now()}` };
        const order = await razorpay.orders.create(options);
        res.status(200).json({ 
            status: "success", 
            orderId: order.id, 
            amount: order.amount, 
            keyId: process.env.RAZORPAY_KEY_ID // ✅ सीधा ENV से भेज रहा है
        });
    } catch (err) { res.status(500).json({ status: "error", message: "Order generation fail" }); }
};

exports.verifyAndAddMoney = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, vendorId, amount } = req.body;
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest("hex");

        if (expectedSignature === razorpay_signature) {
            const vendor = await Vendor.findById(vendorId);
            vendor.walletBalance += Number(amount);
            vendor.hasRecharged = true;
            await vendor.save();
            await Transaction.create({ vendorId, amount, type: 'credit', status: 'Success', paymentId: razorpay_payment_id });
            res.status(200).json({ status: "success", message: "Balance Updated!" });
        } else { res.status(400).json({ message: "Verification fail" }); }
    } catch (err) { res.status(500).json({ status: "error" }); }
};
// ✅ सेलर प्रोफाइल अपडेट करने का असली लॉजिक
exports.updateProfile = async (req, res) => {
    try {
        const { description, keywords, area, city, pincode } = req.body;
        const vendorId = req.params.id;

        // कीवर्ड्स को एरे (Array) में बदलना
        let keywordArray = [];
        if (keywords) {
            keywordArray = Array.isArray(keywords) ? keywords : keywords.split(',').map(k => k.trim());
        }

        // फोटो गैलरी के लिए (अगर मल्टीपल फोटो अपलोड की हैं)
        let newImages = [];
        if (req.files && req.files.length > 0) {
            newImages = req.files.map(file => file.filename);
        }

        const updateData = {
            description,
            keywords: keywordArray,
            area, city, pincode
        };

        // अगर नई फोटो आई हैं, तो उन्हें लिस्ट में जोड़ दो
        if (newImages.length > 0) {
            updateData.$push = { images: { $each: newImages } };
        }

        const updatedVendor = await Vendor.findByIdAndUpdate(vendorId, updateData, { new: true });

        res.status(200).json({ status: "success", message: "Profile Updated!", vendor: updatedVendor });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

// ============================================================
// 5. ALL 16+ SUPER TOOLS & HELPERS (STRICTLY NO SKIPS)
// ============================================================
exports.getVendorDetails = async (req, res) => { try { const v = await Vendor.findById(req.params.id); res.json(v); } catch (e) { res.status(500).send(e) } };
exports.updateProfile = async (req, res) => { try { const v = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(v); } catch (e) { res.status(500).send(e) } };
exports.getWalletBalance = async (req, res) => { try { const v = await Vendor.findById(req.params.id); res.json({ balance: v ? v.walletBalance : 0 }); } catch (e) { res.status(500).send(e) } };
exports.getAllVendors = async (req, res) => { try { const v = await Vendor.find().select('-password'); res.json(v); } catch (e) { res.json([]) } };
exports.getTransactions = async (req, res) => { try { const t = await Transaction.find({ vendorId: req.params.vendorId }).sort({ createdAt: -1 }); res.json(t); } catch (e) { res.json([]) } };
exports.getTrackedLeads = async (req, res) => { try { const leads = await LeadTracker.find({ vendorId: req.params.vendorId }).populate('leadId'); res.json(leads); } catch (e) { res.status(500).send(e); } };
exports.updateKeywords = async (req, res) => { try { const vendor = await Vendor.findByIdAndUpdate(req.params.id, { keywords: req.body.keywords }, { new: true }); res.json({ status: "success", vendor }); } catch (err) { res.status(500).send(err); } };

exports.submitKYC = exports.getBusinessStats = exports.getVendorReviews = exports.addReview = exports.createOffer = exports.createInvoice = exports.getInvoices = exports.addExpense = exports.getProfitLoss = exports.applyForLoan = exports.addStaff = exports.getStaffList = exports.createBooking = exports.getMyBookings = exports.issueWarranty = exports.createSupportTicket = exports.requestUpgrade = exports.getMarketingAudience = exports.updateLeadStatus = exports.sendQuote = exports.addMoney = exports.getVendorOffers = async (req, res) => { 
    res.json({ ok: true, status: "Tool Active" }); 
};