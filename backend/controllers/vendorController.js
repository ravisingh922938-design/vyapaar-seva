const Vendor = require('../models/Vendor');
const LeadTracker = require('../models/LeadTracker');
const Transaction = require('../models/Transaction');
const Lead = require('../models/Lead'); // ✅ पक्का करें कि models/Lead.js फ़ाइल मौजूद है
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// ✅ LIVE RAZORPAY CONFIG
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'dummy',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy',
});

// ============================================================
// 1. VENDOR AUTH (Registration & Login)
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
            return res.status(400).json({ status: "error", message: "Email/Phone pehle se मौजूद है!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const myReferralCode = "VISTER" + Math.floor(1000 + Math.random() * 9000);

        let keywordArray = Array.isArray(keywords) ? keywords : (keywords ? keywords.split(',').map(k => k.trim()) : []);

        const newVendor = new Vendor({
            name, shopName, phone: cleanPhone, email: email.toLowerCase(),
            password: hashedPassword, category, area, pincode, city, state,
            fullAddress, description: description || "Quality service provider.",
            keywords: keywordArray, 
            shopImage: req.file ? req.file.filename : "",
            walletBalance: 0, referralCode: myReferralCode
        });

        await newVendor.save();
        res.status(201).json({ status: "success", message: "Registration Successful! Ab login karein." });
    } catch (err) {
        console.error("Reg Error:", err.message);
        res.status(500).json({ status: "error", message: "Server Error: " + err.message });
    }
};

exports.loginVendor = async (req, res) => {
    try {
        const { email, password } = req.body;
        const seller = await Vendor.findOne({ email: email.toLowerCase() });
        if (!seller) return res.status(404).json({ status: "error", message: "User nahi mila!" });

        const isMatch = await bcrypt.compare(password, seller.password);
        if (!isMatch) return res.status(400).json({ status: "error", message: "Password galat hai!" });

        const token = jwt.sign({ id: seller._id }, process.env.JWT_SECRET || 'vister_key_2026', { expiresIn: '30d' });

        res.status(200).json({
            status: "success", token,
            seller: { id: seller._id, shopName: seller.shopName, email: seller.email, category: seller.category, isVerified: seller.isVerified }
        });
    } catch (err) { res.status(500).json({ status: "error", message: "Login Error" }); }
};

// ============================================================
// 2. LEAD MANAGEMENT (Unlock Logic) - ✅ इससे लीड्स दिखेंगी
// ============================================================
exports.unlockLead = async (req, res) => {
    try {
        const { vendorId, leadId } = req.body;
        const COST = 20; 

        const vendor = await Vendor.findById(vendorId);
        const lead = await Lead.findById(leadId);

        if (!vendor || !lead) return res.status(404).json({ message: "Data nahi mila" });
        if (vendor.walletBalance < COST) return res.status(400).json({ message: "Balance kam hai, recharge karein!" });

        if (lead.unlockedBy && lead.unlockedBy.includes(vendorId)) {
            return res.status(200).json({ status: "success", customerPhone: lead.customerPhone });
        }

        vendor.walletBalance -= COST;
        if (!lead.unlockedBy) lead.unlockedBy = [];
        lead.unlockedBy.push(vendorId);

        await vendor.save();
        await lead.save();

        await Transaction.create({
            vendorId, amount: COST, type: 'debit', status: 'Success', description: `Unlocked Lead: ${lead.customerName}`
        });

        res.status(200).json({ status: "success", customerPhone: lead.customerPhone });
    } catch (err) {
        res.status(500).json({ message: "Unlock fail: " + err.message });
    }
};

// ============================================================
// 3. RECHARGE (Razorpay Live)
// ============================================================
exports.initiateRecharge = async (req, res) => {
    try {
        const { amount, vendorId } = req.body;
        const options = { amount: Number(amount) * 100, currency: "INR", receipt: `rcg_${vendorId}_${Date.now()}` };
        const order = await razorpay.orders.create(options);
        res.status(200).json({ status: "success", orderId: order.id, amount: order.amount, keyId: process.env.RAZORPAY_KEY_ID });
    } catch (err) { 
        console.error("Order Fail:", err.message);
        res.status(500).json({ status: "error", message: "Razorpay Error: " + err.message }); 
    }
};

exports.verifyAndAddMoney = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, vendorId, amount } = req.body;
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "").update(body.toString()).digest("hex");

        if (expectedSignature === razorpay_signature) {
            const vendor = await Vendor.findById(vendorId);
            vendor.walletBalance += Number(amount);
            vendor.hasRecharged = true;
            await vendor.save();
            await Transaction.create({ vendorId, amount, type: 'credit', status: 'Success', paymentId: razorpay_payment_id });
            res.status(200).json({ status: "success", message: "Added Successfully!", newBalance: vendor.walletBalance });
        } else { res.status(400).json({ message: "Verification failed" }); }
    } catch (err) { res.status(500).json({ message: "Verification Error" }); }
};

// ============================================================
// 4. SEARCH & KEYWORDS
// ============================================================
exports.searchVendors = async (req, res) => {
    try {
        const { query, categoryId, city, area } = req.query;
        let filter = {};
        if (categoryId) filter.category = categoryId;
        if (city) filter.city = city;
        if (area) filter.area = area;
        if (query) filter.$or = [{ shopName: { $regex: query, $options: 'i' } }, { keywords: { $in: [new RegExp(query, 'i')] } }];
        const vendors = await Vendor.find(filter).sort({ isVerified: -1 });
        res.json(vendors);
    } catch (err) { res.status(500).send(err); }
};

exports.updateKeywords = async (req, res) => {
    try {
        const { keywords } = req.body;
        const keywordArray = Array.isArray(keywords) ? keywords : keywords.split(',').map(k => k.trim());
        const vendor = await Vendor.findByIdAndUpdate(req.params.id, { keywords: keywordArray }, { new: true });
        res.json({ status: "success", vendor });
    } catch (err) { res.status(500).send(err); }
};

// ============================================================
// 5. SUPER TOOLS & HELPERS (BAKI SARE TOOLS)
// ============================================================
exports.getVendorDetails = async (req, res) => { try { const v = await Vendor.findById(req.params.id).populate('category').select('-password'); res.json(v); } catch (e) { res.status(500).send(e) } };
exports.updateProfile = async (req, res) => { try { const v = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(v); } catch (e) { res.status(500).send(e) } };
exports.getWalletBalance = async (req, res) => { try { const v = await Vendor.findById(req.params.id); res.json({ balance: v ? v.walletBalance : 0 }); } catch (e) { res.status(500).send(e) } };
exports.getAllVendors = async (req, res) => { try { const v = await Vendor.find().select('-password'); res.json(v); } catch (e) { res.json([]) } };
exports.getTransactions = async (req, res) => { try { const t = await Transaction.find({ vendorId: req.params.vendorId }).sort({ createdAt: -1 }); res.json(t); } catch (e) { res.json([]) } };
exports.getTrackedLeads = async (req, res) => { try { const leads = await LeadTracker.find({ vendorId: req.params.vendorId }).populate('leadId'); res.json(leads); } catch (e) { res.status(500).send(e); } };

// --- PLACEHOLDERS ---
exports.submitKYC = async (req, res) => { res.json({ status: "success", message: "KYC Pending" }); };
exports.getBusinessStats = async (req, res) => { res.json({ views: 0, calls: 0 }); };
exports.getVendorReviews = async (req, res) => { res.json([]); };
exports.addReview = async (req, res) => { res.json({ ok: true }); };
exports.createOffer = async (req, res) => { res.json({ ok: true }); };
exports.createInvoice = async (req, res) => { res.json({ ok: true }); };
exports.getInvoices = async (req, res) => { res.json([]); };
exports.addExpense = async (req, res) => { res.json({ ok: true }); };
exports.getProfitLoss = async (req, res) => { res.json({ ok: true }); };
exports.applyForLoan = async (req, res) => { res.json({ ok: true }); };
exports.addStaff = async (req, res) => { res.json({ ok: true }); };
exports.getStaffList = async (req, res) => { res.json([]); };
exports.createBooking = async (req, res) => { res.json({ ok: true }); };
exports.getMyBookings = async (req, res) => { res.json([]); };
exports.issueWarranty = async (req, res) => { res.json({ ok: true }); };
exports.createSupportTicket = async (req, res) => { res.json({ ok: true }); };
exports.updateLeadStatus = async (req, res) => { res.json({ ok: true }); };
exports.sendQuote = async (req, res) => { res.json({ ok: true }); };
exports.getMarketingAudience = async (req, res) => { res.json([]); };
exports.addMoney = async (req, res) => { res.json({ ok: true }); };