const Lead = require('../models/Lead');
const Vendor = require('../models/Vendor');
const axios = require('axios');

// ============================================================
// 1. HELPER: SMS ALERT (सेलर्स को मैसेज भेजने के लिए)
// ============================================================
const sendAlertToSellers = async (phoneList, categoryName) => {
    try {
        const API_KEY = process.env.FAST2SMS_API_KEY;
        if (!API_KEY) return; 

        const message = `Vyapaar Seva: Nayi Lead aayi hai! Category: ${categoryName}. Turant App kholiye.`;

        await axios.post("https://www.fast2sms.com/dev/bulkV2", {
            "route": "q",
            "message": message,
            "language": "english",
            "numbers": phoneList,
        }, {
            headers: { "authorization": API_KEY }
        });
        console.log(`✅ SMS Alerts sent to: ${phoneList}`);
    } catch (err) {
        console.error("❌ SMS Alert Fail:", err.message);
    }
};

// ============================================================
// ✅ 2. CREATE LEAD (इंक्वायरी सेव करना - NO MORE OBJECTID ERROR)
// ============================================================
exports.verifyAndCreateLead = async (req, res) => {
    try {
        // मंतु भाई, यहाँ हमने सारे ज़रूरी फील्ड्स निकाल लिए हैं
        const { customerName, customerPhone, category, area, pincode, description, fullAddress } = req.body;

        // बुनियादी जाँच
        if (!customerName || !customerPhone || !category) {
            return res.status(400).json({ status: "error", message: "Details missing hain (Naam, Phone ya Category)!" });
        }

        const cleanPhone = customerPhone.replace(/\D/g, '').slice(-10);

        // 💾 मंतु भाई, अब ये 'Plumber' या 'ID' दोनों को String की तरह सेव करेगा
        const newLead = new Lead({
            customerName,
            customerPhone: cleanPhone,
            category: String(category), // ✅ String में बदल दिया ताकी Cast Error न आए
            area,
            pincode,
            description: description || "Service Request",
            fullAddress: fullAddress || ""
        });

        await newLead.save();

        // 🔍 इस काम (Category) से जुड़े वेंडर्स को ढूँढना ताकी उन्हें SMS जाए
        // हम ID और नाम दोनों तरीके चेक कर रहे हैं ताकी कोई वेंडर न छूटे
        const matchingVendors = await Vendor.find({
            $or: [
                { category: category },
                { keywords: { $in: [new RegExp(category, 'i')] } }
            ]
        }).select('phone');

        if (matchingVendors.length > 0) {
            const phoneNumbers = matchingVendors.map(v => v.phone).join(',');
            sendAlertToSellers(phoneNumbers, category);
        }

        console.log(`🔥 Nayi Lead Saved: ${customerName} for ${category}`);

        res.status(201).json({
            status: "success",
            message: "Enquiry submitted successfully!",
            lead: newLead
        });

    } catch (err) {
        console.error("❌ Lead Create Error:", err.message);
        res.status(500).json({ status: "error", message: "Database save fail: " + err.message });
    }
};

// ============================================================
// 3. GET LEADS FOR SELLER (सेलर डैशबोर्ड के लिए)
// ============================================================
exports.getLeadsForSeller = async (req, res) => {
    try {
        const { categoryId } = req.params;

        // सेलर की कैटेगरी के हिसाब से लीड्स ढूँढना (नाम या ID दोनों पर चलेगा)
        const leads = await Lead.find({ category: categoryId }).sort({ createdAt: -1 });

        res.status(200).json({
            status: "success",
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
    res.status(200).json({ status: "success", message: "OTP Skip (Direct Mode Active)" });
};

exports.getAllLeads = async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};