const Lead = require('../models/Lead');
const Vendor = require('../models/Vendor');
const axios = require('axios');

// ============================================================
// 1. HELPER FUNCTION: REAL-TIME SMS ALERT (Fast2SMS)
// ============================================================
const sendAlertToSellers = async (phoneList, categoryName) => {
    try {
        const API_KEY = process.env.FAST2SMS_API_KEY;
        const message = `Vyapaar Seva: Nayi Lead aayi hai! Category: ${categoryName}. Turant apna App kholiye aur lead UNLOCK kijiye.`;

        // Fast2SMS 'q' route use kar rahe hain (SABSE FAST AUR RELIABLE)
        await axios.post("https://www.fast2sms.com/dev/bulkV2", {
            "route": "q",
            "message": message,
            "language": "english",
            "numbers": phoneList, // Comma separated list (e.g. "999...,888...")
        }, {
            headers: { "authorization": API_KEY }
        });

        console.log(`✅ Alerts sent successfully to: ${phoneList}`);
    } catch (err) {
        console.error("❌ SMS Alert Fail:", err.message);
    }
};

// ============================================================
// 2. CREATE LEAD + TRIGGER ALERTS (Main Function)
// ============================================================
exports.verifyAndCreateLead = async (req, res) => {
    try {
        const { customerName, customerPhone, category, area, description, fullAddress } = req.body;

        // 🛡️ Step 1: Validation
        if (!customerName || !customerPhone || !category) {
            return res.status(400).json({ status: "error", message: "Zaroori details missing hain." });
        }

        const cleanPhone = customerPhone.replace(/\D/g, '').slice(-10);

        // 💾 Step 2: Database me Lead save karo
        const newLead = await Lead.create({
            customerName,
            customerPhone: cleanPhone,
            category,
            area,
            description, // (Purpose)
            fullAddress
        });

        // 🔍 Step 3: IndiaMart Logic - Matching Category ke Sellers dhundo
        const matchingVendors = await Vendor.find({ category: category }).select('phone');

        // 📢 Step 4: Agar sellers mil gaye, toh unhe ALERT bhejo
        if (matchingVendors.length > 0) {
            const phoneNumbers = matchingVendors.map(v => v.phone).join(',');

            // Background me SMS bhejo (Customer ko wait nahi karwayenge)
            sendAlertToSellers(phoneNumbers, description || "New Service Request");
        }

        console.log(`🔥 LEAD LIVE: ${customerName} | Notified ${matchingVendors.length} Sellers.`);

        res.status(201).json({
            status: "success",
            message: "Enquiry submitted! Sellers have been notified.",
            lead: newLead,
            notifiedSellers: matchingVendors.length
        });

    } catch (err) {
        console.error("❌ Fatal Lead Error:", err.message);
        res.status(500).json({ status: "error", message: "Database save fail!" });
    }
};

// ============================================================
// 3. OTHER HELPER FUNCTIONS
// ============================================================

// Send OTP (Ab ye bypass mode me hai - Sirf success reply bhejega)
exports.sendOTP = async (req, res) => {
    res.status(200).json({ status: "success", message: "OTP Skip (Direct Mode Active)" });
};

// Admin ke liye saari leads ki list
exports.getAllLeads = async (req, res) => {
    try {
        const leads = await Lead.find().populate('category', 'name').sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};