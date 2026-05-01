const Lead = require('../models/Lead');
const Vendor = require('../models/Vendor');
const Category = require('../models/Category'); // ✅ FIX: Category मॉडल को यहाँ इम्पोर्ट करना ज़रूरी था
const axios = require('axios');

// ============================================================
// 1. HELPER: SMS ALERT
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
// 2. CREATE LEAD
// ============================================================
exports.verifyAndCreateLead = async (req, res) => {
    try {
        const { customerName, customerPhone, category, area, pincode, description, fullAddress } = req.body;

        if (!customerName || !customerPhone || !category) {
            return res.status(400).json({ status: "error", message: "Details missing hain!" });
        }

        const cleanPhone = customerPhone.replace(/\D/g, '').slice(-10);

        const newLead = new Lead({
            customerName,
            customerPhone: cleanPhone,
            category: String(category), 
            area,
            pincode,
            description: description || "Service Request",
            fullAddress: fullAddress || ""
        });

        await newLead.save();

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

        res.status(201).json({ status: "success", message: "Enquiry submitted!", lead: newLead });

    } catch (err) {
        res.status(500).json({ status: "error", message: "Database save fail: " + err.message });
    }
};

// ============================================================
// ✅ 3. GET LEADS FOR SELLER (यहाँ सबसे बड़ी गड़बड़ थी जिसे अब सही किया गया है)
// ============================================================
exports.getLeadsForSeller = async (req, res) => {
    try {
        const { categoryId } = req.params; 
        const Category = require('../models/Category');

        // १. पहले इस ID का असली नाम पता करो (जैसे: Plumber)
        // मंतु भाई, यहाँ हम पक्का कर रहे हैं कि अगर ID मिले तो उसका नाम निकाल लें
        let searchTerms = [categoryId]; 

        if (categoryId.length === 24) { // अगर MongoDB ID है
            const catDoc = await Category.findById(categoryId).catch(e => null);
            if (catDoc) {
                searchTerms.push(catDoc.name); // अब लिस्ट में "Plumber" भी है
                console.log(`🔎 Found Name "${catDoc.name}" for ID: ${categoryId}`);
            }
        }

        // २. अब लीड्स ढूँढो जो या तो ID से मैच करें या नाम से
        const leads = await Lead.find({
            category: { $in: searchTerms } // ID या नाम, जो भी मिल जाए
        }).sort({ createdAt: -1 });

        console.log(`✅ Leads found: ${leads.length} for Category identifier: ${categoryId}`);

        res.status(200).json({
            status: "success",
            leads: leads
        });
    } catch (err) {
        console.error("Lead Fetch Error:", err.message);
        res.status(200).json({ status: "success", leads: [] }); 
    }
};
// ============================================================
// 4. OTHER HELPERS
// ============================================================
exports.sendOTP = async (req, res) => {
    res.status(200).json({ status: "success", message: "OTP Skip" });
};

exports.getAllLeads = async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};