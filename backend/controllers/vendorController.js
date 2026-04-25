const Vendor = require('../models/Vendor');
const LeadTracker = require('../models/LeadTracker');
const Transaction = require('../models/Transaction');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ============================================================
// 1. VENDOR REGISTRATION (With Keywords & Location)
// ============================================================
exports.registerVendor = async (req, res) => {
    try {
        console.log("--- Naya Registration Request ---");
        
        const { 
            name, shopName, phone, email, password, 
            category, area, pincode, city, state, 
            fullAddress, description, keywords 
        } = req.body;

        // 🛑 Basic Validation
        if (!email || !password || !phone || !shopName) {
            return res.status(400).json({ status: "error", message: "Zaroori details missing hain!" });
        }

        // Check if seller already exists
        const cleanPhone = phone.replace(/\D/g, '').slice(-10);
        const existing = await Vendor.findOne({ $or: [{ phone: cleanPhone }, { email: email.toLowerCase() }] });

        if (existing) {
            return res.status(400).json({ status: "error", message: "Email ya Phone pehle se register hai!" });
        }

        // 🔐 Password Hashing
        const hashedPassword = await bcrypt.hash(password, 10);
        const myReferralCode = "VISTER" + Math.floor(1000 + Math.random() * 9000);

        // ✅ Keywords Handle करना (अगर String में आए तो Array बनाना)
        let keywordArray = [];
        if (keywords) {
            keywordArray = Array.isArray(keywords) ? keywords : keywords.split(',').map(k => k.trim());
        }

        const newVendor = new Vendor({
            name,
            shopName,
            phone: cleanPhone,
            email: email.toLowerCase(),
            password: hashedPassword,
            category,
            area,
            pincode,
            city,
            state,
            fullAddress,
            description: description || "Quality service provider.",
            keywords: keywordArray,
            image: req.file ? req.file.filename : "", // Schema के हिसाब से
            walletBalance: 0,
            referralCode: myReferralCode
        });

        await newVendor.save();
        console.log("✅ Database me save ho gaya:", email);

        res.status(201).json({
            status: "success",
            message: "Registration Successful! Ab login karein."
        });

    } catch (err) {
        console.error("❌ Registration Error:", err.message);
        res.status(500).json({ status: "error", message: "Server Error: " + err.message });
    }
};

// ============================================================
// 2. VENDOR LOGIN (JWT Based)
// ============================================================
exports.loginVendor = async (req, res) => {
    try {
        const { email, password } = req.body;
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
                category: seller.category,
                isVerified: seller.isVerified
            }
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: "Login Fail" });
    }
};

// ============================================================
// 3. SEARCH & KEYWORDS
// ============================================================

// ✅ कीवर्ड्स अपडेट करने के लिए
exports.updateKeywords = async (req, res) => {
    try {
        const { keywords } = req.body;
        const keywordArray = Array.isArray(keywords) ? keywords : keywords.split(',').map(k => k.trim());
        
        const vendor = await Vendor.findByIdAndUpdate(
            req.params.id, 
            { keywords: keywordArray }, 
            { new: true }
        );
        res.json({ status: "success", vendor });
    } catch (err) {
        res.status(500).send(err);
    }
};

// ✅ एडवांस्ड सर्च (Shop Name + Keywords)
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
    } catch (err) {
        res.status(500).json({ message: "Search Error: " + err.message });
    }
};

// ============================================================
// 4. PROFILE & DETAILS
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

// ============================================================
// 5. HELPER & DUMMY FUNCTIONS (Super Tools)
// ============================================================
exports.updateProfile = async (req, res) => { try { const v = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(v); } catch (e) { res.status(500).send(e) } };
exports.getWalletBalance = async (req, res) => { try { const v = await Vendor.findById(req.params.id); res.json({ balance: v.walletBalance || 0 }); } catch (e) { res.status(500).send(e) } };
exports.getAllVendors = async (req, res) => { try { const v = await Vendor.find().select('-password'); res.json(v); } catch (e) { res.status(500).send(e) } };
exports.addMoney = async (req, res) => { res.json({ ok: true }); };
exports.getTransactions = async (req, res) => { res.json([]); };
exports.unlockLead = async (req, res) => { res.json({ ok: true }); };
exports.submitKYC = async (req, res) => { res.json({ ok: true }); };
exports.getBusinessStats = async (req, res) => { res.json({ views: 0 }); };
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
exports.initiateRecharge = async (req, res) => { res.json({ ok: true }); };
exports.verifyAndAddMoney = async (req, res) => { res.json({ ok: true }); };
exports.getMarketingAudience = async (req, res) => { res.json([]); };

exports.getTrackedLeads = async (req, res) => {
    try {
        const leads = await LeadTracker.find({ vendorId: req.params.vendorId }).populate('leadId');
        res.json(leads);
    } catch (e) { res.status(500).send(e); }
};