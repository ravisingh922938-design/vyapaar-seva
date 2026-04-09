const Vendor = require('../models/Vendor');
const Lead = require('../models/Lead');
const Transaction = require('../models/Transaction');
const Review = require('../models/Review');
const Support = require('../models/Support');
const LeadTracker = require('../models/LeadTracker');
const Offer = require('../models/Offer');
const LoanApplication = require('../models/LoanApplication');
const Compliance = require('../models/Compliance');
const Invoice = require('../models/Invoice');
const Staff = require('../models/Staff');
const Booking = require('../models/Booking');
const Warranty = require('../models/Warranty');
const Expense = require('../models/Expense');
const axios = require('axios');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

let sellerOtpStore = {};

// 1. Auth & Registration
exports.registerVendor = async (req, res) => {
    try {
        const { name, shopName, phone, category, area, description, referredBy } = req.body;
        if (await Vendor.findOne({ phone })) return res.status(400).json({ message: "Already registered!" });
        const refCode = "VISTER" + Math.random().toString(36).substring(2, 7).toUpperCase();
        const vendor = await Vendor.create({ ...req.body, shopImage: req.file ? req.file.filename : "", referralCode: refCode, walletBalance: 0 });
        res.status(201).json({ message: "Success", vendor });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.sendLoginOTP = async (req, res) => {
    try {
        const otp = Math.floor(1000 + Math.random() * 9000);
        sellerOtpStore[req.body.phone] = otp;
        try {
            await axios.post("https://www.fast2sms.com/dev/bulkV2", { "variables_values": otp.toString(), "route": "otp", "numbers": req.body.phone }, { headers: { "authorization": process.env.FAST2SMS_API_KEY } });
        } catch (e) { console.log("SMS failed, use terminal"); }
        console.log(`🔐 OTP for ${req.body.phone}: ${otp}`);
        res.json({ message: "OTP Sent" });
    } catch (err) { res.status(500).json({ message: "Error" }); }
};

exports.verifyLogin = async (req, res) => {
    const { phone, otp } = req.body;
    if (sellerOtpStore[phone] == otp) {
        const vendor = await Vendor.findOne({ phone }).populate('category');
        delete sellerOtpStore[phone];
        res.json({ vendor });
    } else res.status(400).json({ message: "Wrong OTP" });
};

// 2. Profile & Search
exports.getAllVendors = async (req, res) => {
    try { res.json(await Vendor.find().populate('category')); } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.getVendorDetails = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id).populate('category');
        const reviews = await Review.find({ vendorId: req.params.id });
        const offers = await Offer.find({ vendorId: req.params.id });
        res.json({ vendor, reviews, offers });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.updateProfile = async (req, res) => {
    try {
        const updated = await Vendor.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(updated);
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.searchVendors = async (req, res) => {
    try {
        const { query, area, categoryId } = req.query;
        let filter = {};
        if (categoryId) filter.category = categoryId;
        if (area) filter.area = area;
        if (query) filter.$or = [{ shopName: { $regex: query, $options: 'i' } }, { keywords: { $in: [new RegExp(query, 'i')] } }];
        res.json(await Vendor.find(filter).sort({ membershipPlan: -1, isVerified: -1 }));
    } catch (e) { res.status(500).json({ message: e.message }); }
};

// 3. Wallet & Payment
exports.getWalletBalance = async (req, res) => {
    try { const v = await Vendor.findById(req.params.id); res.json({ walletBalance: v.walletBalance }); } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.addMoney = async (req, res) => {
    try {
        const v = await Vendor.findById(req.params.id);
        v.walletBalance += Number(req.body.amount);
        await v.save();
        await Transaction.create({ vendorId: v._id, amount: req.body.amount, type: 'credit', description: "Recharge", status: 'Success' });
        res.json({ newBalance: v.walletBalance });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.initiateRecharge = async (req, res) => {
    try {
        const order = await razorpay.orders.create({ amount: Number(req.body.amount) * 100, currency: "INR", receipt: "rc_" + Date.now() });
        res.json({ order, key_id: process.env.RAZORPAY_KEY_ID });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.verifyAndAddMoney = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, vendorId, amount } = req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(sign).digest("hex");
    if (razorpay_signature === expectedSign) {
        const v = await Vendor.findById(vendorId);
        v.walletBalance += Number(amount); await v.save();
        await Transaction.create({ vendorId, amount, type: 'credit', description: "Razorpay Recharge", status: 'Success', paymentId: razorpay_payment_id });
        res.json({ success: true, newBalance: v.walletBalance });
    } else res.status(400).json({ message: "Invalid Sign" });
};

exports.getTransactions = async (req, res) => {
    try { res.json(await Transaction.find({ vendorId: req.params.vendorId }).sort({ createdAt: -1 })); } catch (e) { res.status(500).json({ message: e.message }); }
};

// 4. Leads & CRM
exports.unlockLead = async (req, res) => {
    try {
        const { vendorId, leadId } = req.body;
        const v = await Vendor.findById(vendorId);
        const l = await Lead.findById(leadId);
        if (l.unlockedBy.includes(vendorId)) return res.json({ customerPhone: l.customerPhone, remainingBalance: v.walletBalance });
        if (v.walletBalance < 20) return res.status(400).json({ message: "Low Balance" });
        v.walletBalance -= 20; await v.save();
        l.unlockedBy.push(vendorId); await l.save();
        await Transaction.create({ vendorId: v._id, amount: 20, type: 'debit', description: `Lead: ${l.customerName}`, status: 'Success' });
        res.json({ customerPhone: l.customerPhone, remainingBalance: v.walletBalance });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.sendQuote = async (req, res) => {
    try { const l = await Lead.findByIdAndUpdate(req.body.leadId, { $push: { quotes: req.body } }, { new: true }); res.json(l); } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.updateLeadStatus = async (req, res) => {
    try { const u = await LeadTracker.findOneAndUpdate({ vendorId: req.body.vendorId, leadId: req.body.leadId }, { $set: req.body }, { upsert: true, new: true }); res.json(u); } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.getTrackedLeads = async (req, res) => {
    try { res.json(await LeadTracker.find({ vendorId: req.params.vendorId }).populate('leadId')); } catch (e) { res.status(500).json({ message: e.message }); }
};

// 5. Business Ops
exports.getBusinessStats = async (req, res) => {
    try {
        const v = await Vendor.findById(req.params.id);
        const count = await Lead.countDocuments({ unlockedBy: req.params.id });
        res.json({ views: v.profileViews, calls: v.totalCalls, leads: count, revenue: count * 500 });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.getVendorReviews = async (req, res) => {
    try {
        const r = await Review.find({ vendorId: req.params.vendorId });
        const avg = r.length > 0 ? r.reduce((a, b) => a + b.rating, 0) / r.length : 0;
        res.json({ reviews: r, averageRating: avg.toFixed(1) });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.addReview = async (req, res) => {
    try { const nr = await Review.create(req.body); await Vendor.findByIdAndUpdate(req.body.vendorId, { $inc: { visterScore: 1 } }); res.status(201).json(nr); } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.createOffer = async (req, res) => {
    try { res.json(await Offer.create(req.body)); } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.getVendorOffers = async (req, res) => {
    try { res.json(await Offer.find({ vendorId: req.params.vendorId })); } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.createInvoice = async (req, res) => {
    try { res.json(await Invoice.create(req.body)); } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.getInvoices = async (req, res) => {
    try { res.json(await Invoice.find({ vendorId: req.params.vendorId })); } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.addExpense = async (req, res) => {
    try { res.json(await Expense.create(req.body)); } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.getProfitLoss = async (req, res) => {
    try {
        const inv = await Invoice.find({ vendorId: req.params.vendorId });
        const exp = await Expense.find({ vendorId: req.params.vendorId });
        const inc = inv.reduce((a, b) => a + b.totalAmount, 0);
        const ex = exp.reduce((a, b) => a + b.amount, 0);
        res.json({ totalIncome: inc, totalExpense: ex, netProfit: inc - ex });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.applyForLoan = async (req, res) => {
    try { res.json(await LoanApplication.create(req.body)); } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.applyForTaxService = async (req, res) => {
    try { res.json(await Compliance.create(req.body)); } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.addStaff = async (req, res) => {
    try { res.json(await Staff.create(req.body)); } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.getStaffList = async (req, res) => {
    try { res.json(await Staff.find({ vendorId: req.params.vendorId })); } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.createBooking = async (req, res) => {
    try { res.json(await Booking.create(req.body)); } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.getMyBookings = async (req, res) => {
    try { res.json(await Booking.find({ vendorId: req.params.vendorId })); } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.issueWarranty = async (req, res) => {
    try {
        const { warrantyMonths } = req.body;
        let exp = new Date(); exp.setMonth(exp.getMonth() + Number(warrantyMonths));
        res.json(await Warranty.create({ ...req.body, expiryDate: exp }));
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.submitKYC = async (req, res) => {
    try { res.json(await Vendor.findByIdAndUpdate(req.body.vendorId, { kycStatus: 'Pending', documents: req.body }, { new: true })); } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.createSupportTicket = async (req, res) => {
    try { res.json(await Support.create(req.body)); } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.requestUpgrade = async (req, res) => {
    try { await Support.create({ vendorId: req.body.vendorId, issueType: 'Other', message: `UPGRADE` }); res.json({ success: true }); } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.getMarketingAudience = async (req, res) => {
    try {
        const inv = await Invoice.find({ vendorId: req.params.vendorId });
        const list = [...new Set(inv.map(i => i.customerPhone))];
        res.json(list);
    } catch (err) { res.status(500).json({ message: err.message }); }
};