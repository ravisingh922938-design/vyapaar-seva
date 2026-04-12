const Vendor = require('../models/Vendor');
const LeadTracker = require('../models/LeadTracker');
const Transaction = require('../models/Transaction');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ============================================================
// 1. SELLER REGISTRATION (Email, Password & Photo)
// ============================================================
exports.registerVendor = async (req, res) => {
    try {
        // 🔥 DEBUG LOG: Ye terminal me dikhayega ki Frontend ne kya-kya bheja
        console.log("--- Naya Registration Request ---");
        console.log("Data Received:", req.body);
        console.log("File Received:", req.file ? req.file.filename : "No Photo");

        const { name, shopName, phone, email, password, category, area, description } = req.body;

        // 🛑 BASIC VALIDATION
        if (!email || !password || !phone) {
            return res.status(400).json({
                status: "error",
                message: "Email, Password aur Phone zaroori hain!"
            });
        }

        // Check if seller already exists
        const cleanPhone = phone.replace(/\D/g, '').slice(-10);
        const existing = await Vendor.findOne({ $or: [{ phone: cleanPhone }, { email: email.toLowerCase() }] });

        if (existing) {
            return res.status(400).json({
                status: "error",
                message: "Ye Email ya Phone pehle se register hai!"
            });
        }

        // 🔐 Password Hashing
        const hashedPassword = await bcrypt.hash(password, 10);
        const myReferralCode = "VISTER" + Math.floor(1000 + Math.random() * 9000);

        const newVendor = new Vendor({
            name,
            shopName,
            phone: cleanPhone,
            email: email.toLowerCase(),
            password: hashedPassword,
            category,
            area,
            description: description || "Patna local expert.",
            shopImage: req.file ? req.file.filename : "",
            walletBalance: 0,
            referralCode: myReferralCode
        });

        await newVendor.save();
        console.log("✅ Database me save ho gaya:", email);

        res.status(201).json({
            status: "success",
            message: "Registration Successful! Ab login karke dashboard dekhein."
        });

    } catch (err) {
        console.error("❌ Registration Error:", err.message);
        res.status(500).json({ status: "error", message: "Server Error: " + err.message });
    }
};

// ============================================================
// 2. SELLER LOGIN (JWT Based)
// ============================================================
exports.loginVendor = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login Attempt:", email);

        const seller = await Vendor.findOne({ email: email.toLowerCase() });
        if (!seller) {
            return res.status(404).json({ status: "error", message: "Email registered nahi hai!" });
        }

        const isMatch = await bcrypt.compare(password, seller.password);
        if (!isMatch) {
            return res.status(400).json({ status: "error", message: "Password galat hai!" });
        }

        const token = jwt.sign(
            { id: seller._id },
            process.env.JWT_SECRET || 'vister_tech_2026_key',
            { expiresIn: '7d' }
        );

        res.status(200).json({
            status: "success",
            token,
            seller: {
                id: seller._id,
                shopName: seller.shopName,
                email: seller.email,
                isVerified: seller.isVerified
            }
        });

    } catch (err) {
        res.status(500).json({ status: "error", message: "Login Fail" });
    }
};

// ============================================================
// 3. SEARCH & PROFILE
// ============================================================
exports.getVendorDetails = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id).populate('category').select('-password');
        if (!vendor) return res.status(404).json({ message: "Vendor not found!" });
        vendor.profileViews += 1;
        await vendor.save();
        res.json(vendor);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.searchVendors = async (req, res) => {
    try {
        const { query, categoryId, area } = req.query;
        let filter = {};
        if (categoryId) filter.category = categoryId;
        if (area) filter.area = area;
        if (query) filter.shopName = { $regex: query, $options: 'i' };

        const vendors = await Vendor.find(filter).sort({ isVerified: -1 });
        res.json(vendors);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// ============================================================
// 4. DUMMY FUNCTIONS (Taki Routes na tutein)
// ============================================================
exports.updateProfile = async (req, res) => { try { const v = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(v); } catch (e) { res.status(500).send(e) } };
exports.getWalletBalance = async (req, res) => { try { const v = await Vendor.findById(req.params.id); res.json({ balance: v.walletBalance }); } catch (e) { res.status(500).send(e) } };
exports.getAllVendors = async (req, res) => { try { const v = await Vendor.find().select('-password'); res.json(v); } catch (e) { res.status(500).send(e) } };
exports.addMoney = async (req, res) => { res.json({ ok: true }); };
exports.getTransactions = async (req, res) => { res.json([]); };
exports.unlockLead = async (req, res) => { res.json({ ok: true }); };
exports.submitKYC = async (req, res) => { res.json({ ok: true }); };
exports.getBusinessStats = async (req, res) => { res.json({ views: 0 }); };
exports.getVendorReviews = async (req, res) => { res.json([]); };
exports.addReview = async (req, res) => { res.json({ ok: true }); };
exports.createOffer = async (req, res) => { res.json({ ok: true }); };
exports.getVendorOffers = async (req, res) => { res.json([]); };
exports.createInvoice = async (req, res) => { res.json({ ok: true }); };
exports.getInvoices = async (req, res) => { res.json([]); };
exports.addExpense = async (req, res) => { res.json({ ok: true }); };
exports.getProfitLoss = async (req, res) => { res.json({ ok: true }); };
exports.applyForLoan = async (req, res) => { res.json({ ok: true }); };
exports.applyForTaxService = async (req, res) => { res.json({ ok: true }); };
exports.addStaff = async (req, res) => { res.json({ ok: true }); };
exports.getStaffList = async (req, res) => { res.json([]); };
exports.createBooking = async (req, res) => { res.json({ ok: true }); };
exports.getMyBookings = async (req, res) => { res.json([]); };
exports.issueWarranty = async (req, res) => { res.json({ ok: true }); };
exports.createSupportTicket = async (req, res) => { res.json({ ok: true }); };
exports.requestUpgrade = async (req, res) => { res.json({ ok: true }); };
exports.getMarketingAudience = async (req, res) => { res.json([]); };
exports.sendLoginOTP = async (req, res) => { res.json({ ok: true }); };
exports.verifyLogin = async (req, res) => { res.json({ ok: true }); };
exports.updateLeadStatus = async (req, res) => { res.json({ ok: true }); };
exports.sendQuote = async (req, res) => { res.json({ ok: true }); };
exports.getTrackedLeads = async (req, res) => {
    try {
        const leads = await LeadTracker.find({ vendorId: req.params.vendorId }).populate('leadId');
        res.json(leads);
    } catch (e) { res.status(500).send(e); }
};
exports.initiateRecharge = async (req, res) => { res.json({ ok: true }); };
exports.verifyAndAddMoney = async (req, res) => { res.json({ ok: true }); };