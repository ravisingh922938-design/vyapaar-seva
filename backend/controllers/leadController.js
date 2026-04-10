const Lead = require('../models/Lead');
const Vendor = require('../models/Vendor');
const axios = require('axios');

// OTP को याद रखने के लिए (In-memory Store)
let otpStore = {};

// ==========================================
// 1. ग्राहक को असली मोबाइल SMS भेजना
// ==========================================
exports.sendOTP = async (req, res) => {
    try {
        let { phone } = req.body;

        // 1. फोन नंबर की सफाई और चेक
        if (!phone) return res.status(400).json({ message: "Mobile number zaroori hai!" });
        phone = phone.replace(/\D/g, '').slice(-10); // सिर्फ आखिरी 10 अंक

        if (phone.length !== 10) {
            return res.status(400).json({ message: "Kripya sahi 10-digit number dalo!" });
        }

        // 2. OTP पैदा करना
        const otp = Math.floor(1000 + Math.random() * 9000);
        otpStore[phone] = otp;

        const apiKey = process.env.FAST2SMS_API_KEY;

        // 3. 🔥 FAST2SMS ASLI SMS LOGIC (GET METHOD)
        // 'otp' route सबसे फ़ास्ट है और सीधा इनबॉक्स में जाता है
        try {
            const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
                params: {
                    authorization: apiKey,
                    route: 'otp',
                    variables_values: otp.toString(),
                    numbers: phone,
                }
            });

            // अगर मैसेज सफल हुआ
            if (response.data.return === true) {
                console.log(`✅ SMS Sent Success to ${phone}. Code: ${otp}`);
                return res.status(200).json({
                    message: "OTP aapke mobile par bhej diya gaya hai!",
                    status: "success"
                });
            } else {
                console.log("❌ Fast2SMS Error:", response.data.message);
                throw new Error(response.data.message);
            }

        } catch (smsErr) {
            // बैकअप के लिए टर्मिनल में भी कोड दिखेगा ताकि टेस्टिंग न रुके
            console.log(`\n⚠️ SMS Fail: ${smsErr.message}. Showing in terminal instead.`);
            console.log(`🚀 VISTER BACKUP CODE FOR ${phone}: ${otp}\n`);

            return res.status(200).json({
                message: "OTP initiated. Terminal check karein agar mobile par nahi aaya.",
                isTestMode: true
            });
        }

    } catch (err) {
        console.error("❌ Critical Error:", err.message);
        res.status(500).json({ message: "Server Down! OTP bhej nahi paaye." });
    }
};

// ==========================================
// 2. OTP Verify करना और Lead (Enquiry) बनाना
// ==========================================
exports.verifyAndCreateLead = async (req, res) => {
    try {
        const {
            customerName,
            customerPhone,
            category,
            area,
            description,
            fullAddress,
            otp
        } = req.body;

        let cleanPhone = customerPhone.replace(/\D/g, '').slice(-10);

        // 1. OTP चेक करना
        if (otpStore[cleanPhone] && otpStore[cleanPhone] == otp) {

            // 2. डेटाबेस में Enquiry (Lead) सेव करना
            const newLead = await Lead.create({
                customerName,
                customerPhone: cleanPhone,
                category,
                area,
                description, // (इसे 'purpose' माना जाएगा)
                fullAddress
            });

            // 3. मैचिंग सेलर्स को अलर्ट (बाद में WhatsApp API यहाँ लगेगी)
            const matchingVendors = await Vendor.find({ category, area });
            console.log(`📢 LEAD LIVE: Found ${matchingVendors.length} vendors in ${area}.`);

            // 4. इस्तेमाल के बाद OTP मिटा दें
            delete otpStore[cleanPhone];

            res.status(201).json({
                message: "Verified! Enquiry Successfully Submitted.",
                lead: newLead,
                matchingVendors: matchingVendors.length
            });
        } else {
            res.status(400).json({ message: "Galti! Sahi OTP dalo bhai." });
        }
    } catch (err) {
        console.error("Verify Error:", err);
        res.status(500).json({ message: "Verification process fail ho gayi." });
    }
};

// ==========================================
// 3. सभी Leads की लिस्ट (For Admin)
// ==========================================
exports.getAllLeads = async (req, res) => {
    try {
        const leads = await Lead.find().populate('category').sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};