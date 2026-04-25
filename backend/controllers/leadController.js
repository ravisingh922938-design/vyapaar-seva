const Lead = require('../models/Lead');
const Vendor = require('../models/Vendor');
const axios = require('axios');

// ============================================================
// 1. HELPER: SMS ALERT (ये बैकग्राउंड में चलेगा)
// ============================================================
const sendAlertToSellers = async (phoneList, categoryName) => {
    try {
        const API_KEY = process.env.FAST2SMS_API_KEY;
        if (!API_KEY) return; // अगर की नहीं है तो छोड़ दो

        const message = `Vyapaar Seva: Nayi Lead aayi hai! Category: ${categoryName}. Turant App kholiye.`;

        await axios.post("https://www.fast2sms.com/dev/bulkV2", {
            "route": "q",
            "message": message,
            "language": "english",
            "numbers": phoneList,
        }, {
            headers: { "authorization": API_KEY }
        });
        console.log(`✅ Alerts sent to sellers.`);
    } catch (err) {
        console.error("❌ SMS Alert Fail:", err.message);
    }
};

// ============================================================
// 2. CREATE LEAD (इंक्वायरी सेव करना)
// ============================================================
exports.verifyAndCreateLead = async (req, res) => {
    try {
        // मंतु भाई, यहाँ हमने pincode और area को पक्का कर दिया है
        const { customerName, customerPhone, category, area, pincode, description, fullAddress } = req.body;

        if (!customerName || !customerPhone || !category) {
            return res.status(400).json({ status: "error", message: "Details missing hain." });
        }

        const cleanPhone = customerPhone.replace(/\D/g, '').slice(-10);

        // 💾 डेटाबेस में लीड सेव करना
        const newLead = await Lead.create({
            customerName,
            customerPhone: cleanPhone,
            category, // ये Category ID होनी चाहिए
            area,
            pincode,
            description: description || "Service Request",
            fullAddress
        });

        // 🔍 इस कैटेगरी के सेलर्स को ढूँढना
        const matchingVendors = await Vendor.find({ category: category }).select('phone');

        if (matchingVendors.length > 0) {
            const phoneNumbers = matchingVendors.map(v => v.phone).join(',');
            sendAlertToSellers(phoneNumbers, "Vyapaar Seva Service");
        }

        res.status(201).json({
            status: "success",
            message: "Enquiry submitted!",
            lead: newLead
        });

    } catch (err) {
        console.error("❌ Lead Create Error:", err.message);
        res.status(500).json({ status: "error", message: "Database error: " + err.message });
    }
};

// ============================================================
// ✅ 3. GET LEADS FOR SELLER (ये फंक्शन मिसिंग था - अब लीड्स दिखेंगी)
// ============================================================
exports.getLeadsForSeller = async (req, res) => {
    try {
        const { categoryId } = req.params;

        // सेलर की कैटेगरी के हिसाब से सारी लीड्स ढूँढना (सबसे नयी वाली पहले)
        const leads = await Lead.find({ category: categoryId }).sort({ createdAt: -1 });

        res.status(200).json({
            status: "success",
            count: leads.length,
            leads: leads
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: "Leads fetch fail!" });
    }
};

// ============================================================
// 4. OTHER HELPERS
// ============================================================
exports.sendOTP = async (req, res) => {
    res.status(200).json({ status: "success", message: "OTP Skip Mode" });
};

exports.getAllLeads = async (req, res) => {
    try {
        const leads = await Lead.find().populate('category', 'name').sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};