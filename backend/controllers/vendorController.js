const Vendor = require('../models/Vendor');
const LeadTracker = require('../models/LeadTracker');
const Transaction = require('../models/Transaction');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay'); // ✅ लाइव रिचार्ज के लिए ज़रूरी
const crypto = require('crypto');      // ✅ पेमेंट वेरिफिकेशन के लिए

// ✅ Razorpay Initialize (Keys .env से आएँगी)
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ============================================================
// 1. VENDOR REGISTRATION (With All India Location & Keywords)
// ============================================================
exports.registerVendor = async (req, res) => {
    try {
        console.log("--- Naya Registration Request ---");
        const { 
            name, shopName, phone, email, password, 
            category, area, pincode, city, state, 
            fullAddress, description, keywords 
        } = req.body;

        if (!email || !password || !phone || !shopName) {
            return res.status(400).json({ status: "error", message: "Zaroori details missing hain!" });
        }

        const cleanPhone = phone.replace(/\D/g, '').slice(-10);
        const existing = await Vendor.findOne({ $or: [{ phone: cleanPhone }, { email: email.toLowerCase() }] });

        if (existing) {
            return res.status(400).json({ status: "error", message: "Email ya Phone pehle se register hai!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const myReferralCode = "VISTER" + Math.floor(1000 + Math.random() * 9000);

        let keywordArray = [];
        if (keywords) {
            keywordArray = Array.isArray(keywords) ? keywords : keywords.split(',').map(k => k.trim());
        }

        const newVendor = new Vendor({
            name, shopName, phone: cleanPhone, email: email.toLowerCase(),
            password: hashedPassword, category, area, pincode, city, state,
            fullAddress, description: description || "Service provider.",
            keywords: keywordArray, 
            shopImage: req.file ? req.file.filename : "", // ✅ Model के हिसाब से shopImage
            walletBalance: 0, referralCode: myReferralCode
        });

        await newVendor.save();
        res.status(201).json({ status: "success", message: "Registration Successful! Ab login karein." });
    } catch (err) {
        res.status(500).json({ status: "error", message: "Server Error: " + err.message });
    }
};

// ============================================================
// 2. VENDOR LOGIN
// ============================================================
exports.loginVendor = async (req, res) => {
    try {
        const { email, password } = req.body;
        const seller = await Vendor.findOne({ email: email.toLowerCase() });
        if (!seller) return res.status(404).json({ status: "error", message: "Email registered nahi hai!" });

        const isMatch = await bcrypt.compare(password, seller.password);
        if (!isMatch) return res.status(400).json({ status: "error", message: "Password galat hai!" });

        const token = jwt.sign({ id: seller._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(200).json({
            status: "success", token,
            seller: { id: seller._id, shopName: seller.shopName, email: seller.email, category: seller.category, isVerified: seller.isVerified }
        });
    } catch (err) { res.status(500).json({ status: "error", message: "Login Fail" }); }
};

// ============================================================
// 3. SEARCH & KEYWORDS
// ============================================================
exports.updateKeywords = async (req, res) => {
    try {
        const { keywords } = req.body;
        const keywordArray = Array.isArray(keywords) ? keywords : keywords.split(',').map(k => k.trim());
        const vendor = await Vendor.findByIdAndUpdate(req.params.id, { keywords: keywordArray }, { new: true });
        res.json({ status: "success", vendor });
    } catch (err) { res.status(500).send(err); }
};

exports.searchVendors = async (req, res) => {
    try {
        const { query, categoryId, city, area } = req.query;
        let filter = {};
        if (categoryId) filter.category = categoryId;
        if (city) filter.city = city;
        if (area) filter.area = area;
        if (query) {
            filter.$or = [
                { shopName: { $regex: query, $options: 'i' } }, 
                { keywords: { $in: [new RegExp(query, 'i')] } }
            ];
        }
        const vendors = await Vendor.find(filter).sort({ isVerified: -1 });
        res.json(vendors);
    } catch (err) { res.status(500).json({ message: "Search Error: " + err.message }); }
};

// ============================================================
// ✅ 4. RECHARGE LOGIC (AB YE REAL RAZORPAY HAI)
// ============================================================
exports.initiateRecharge = async (req, res) => {
    try {
        const { amount, vendorId } = req.body;
        if (!amount || amount < 100) return res.status(400).json({ message: "Min ₹100 required" });

        const options = {
            amount: Number(amount) * 100, // पैसे में बदलें
            currency: "INR",
            receipt: `rcg_${vendorId}_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json({
            status: "success",
            orderId: order.id,
            amount: order.amount,
            keyId: process.env.RAZORPAY_KEY_ID
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: "Razorpay Order Fail: " + err.message });
    }
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
            res.status(200).json({ status: "success", message: "Paisa jud gaya!", newBalance: vendor.walletBalance });
        } else {
            res.status(400).json({ status: "error", message: "Signature fail!" });
        }
    } catch (err) { res.status(500).json({ status: "error", message: "Server Error" }); }
};

// ============================================================
// 5. PROFILE & SUPER TOOLS
// ============================================================
exports.getVendorDetails = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id).populate('category').select('-password');
        if (!vendor) return res.status(404).json({ message: "Vendor not found!" });
        vendor.profileViews = (vendor.profileViews || 0) + 1;
        await vendor.save();
        res.json(vendor);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateProfile = async (req, res) => { try { const v = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(v); } catch (e) { res.status(500).send(e) } };
exports.getWalletBalance = async (req, res) => { try { const v = await Vendor.findById(req.params.id); res.json({ balance: v.walletBalance || 0 }); } catch (e) { res.status(500).send(e) } };
exports.getTransactions = async (req, res) => { 
    try { const txns = await Transaction.find({ vendorId: req.params.vendorId }).sort({ createdAt: -1 }); res.json(txns); } catch (e) { res.json([]); }
};
exports.unlockLead = async (req, res) => { res.json({ ok: true }); };
exports.submitKYC = async (req, res) => { res.json({ ok: true }); };
exports.getBusinessStats = async (req, res) => { res.json({ views: 0 }); };
exports.addReview = async (req, res) => { res.json({ ok: true }); };
exports.createInvoice = async (req, res) => { res.json({ ok: true }); };
exports.getInvoices = async (req, res) => { res.json([]); };
exports.getProfitLoss = async (req, res) => { res.json({ ok: true }); };
exports.addStaff = async (req, res) => { res.json({ ok: true }); };
exports.getStaffList = async (req, res) => { res.json([]); };
exports.createBooking = async (req, res) => { res.json({ ok: true }); };
exports.getMyBookings = async (req, res) => { res.json([]); };
exports.updateLeadStatus = async (req, res) => { res.json({ ok: true }); };
exports.getTrackedLeads = async (req, res) => {
    try { const leads = await LeadTracker.find({ vendorId: req.params.vendorId }).populate('leadId'); res.json(leads); } catch (e) { res.status(500).send(e); }
};
exports.getAllVendors = async (req, res) => { try { const v = await Vendor.find().select('-password'); res.json(v); } catch (e) { res.status(500).send(e) } };
exports.addMoney = async (req, res) => { res.json({ ok: true }); };
exports.getVendorReviews = async (req, res) => { res.json([]); };
exports.createOffer = async (req, res) => { res.json({ ok: true }); };
exports.addExpense = async (req, res) => { res.json({ ok: true }); };
exports.applyForLoan = async (req, res) => { res.json({ ok: true }); };
exports.issueWarranty = async (req, res) => { res.json({ ok: true }); };
exports.createSupportTicket = async (req, res) => { res.json({ ok: true }); };
exports.sendQuote = async (req, res) => { res.json({ ok: true }); };
exports.getMarketingAudience = async (req, res) => { res.json([]); };