const Lead = require('../models/Lead');
const Vendor = require('../models/Vendor');
const axios = require('axios');

// OTP को याद रखने के लिए (In-memory Store)
let otpStore = {};

// ==========================================
// 1. ग्राहक को OTP भेजना (Fast2SMS Smart Logic)
// ==========================================
exports.sendOTP = async (req, res) => {
    try {
        let { phone } = req.body;

        // 1. Phone number saaf karein
        if (!phone) return res.status(400).json({ message: "Mobile number zaroori hai!" });
        phone = phone.replace(/\D/g, '').slice(-10);

        if (phone.length !== 10) {
            return res.status(400).json({ message: "Sahi 10-digit number dalo!" });
        }

        const otp = Math.floor(1000 + Math.random() * 9000);
        otpStore[phone] = otp;

        const apiKey = process.env.FAST2SMS_API_KEY;

        // 2. 🔥 SMS BHEJNE KA PRAYAS (Using 'q' route to bypass verification)
        try {
            const response = await axios.post("https://www.fast2sms.com/dev/bulkV2", {
                "route": "q",
                "message": `Aapka Vyapaar Seva verification code hai: ${otp}. Kripya ise share na karein.`,
                "language": "english",
                "numbers": phone,
            }, {
                headers: { "authorization": apiKey }
            });

            if (response.data.return === true) {
                console.log(`✅ SMS Sent Success to ${phone}. OTP: ${otp}`);
                return res.json({ message: "OTP mobile par bhej diya gaya hai!" });
            }
        } catch (smsErr) {
            console.log("⚠️ SMS API Restricted (996/Verify). Switching to Terminal Mode.");
        }

        // 3. 💡 DEVELOPER BYPASS (Terminal Fallback)
        // Agar SMS nahi gaya toh website crash nahi hogi, terminal mein code dikhega
        console.log(`\n------------------------------------------`);
        console.log(`🚀 VISTER TEST OTP FOR ${phone} IS: ${otp}`);
        console.log(`👉 Form mein ye code dalo aur aage badho.`);
        console.log(`------------------------------------------\n`);

        res.status(200).json({
            message: "Verification initiated. Check terminal for code.",
            isTestMode: true
        });

    } catch (err) {
        console.error("❌ Fatal Error in sendOTP:", err.message);
        res.status(500).json({ message: "Server error" });
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

        // Phone number clean karein matching ke liye
        let cleanPhone = customerPhone.replace(/\D/g, '').slice(-10);

        // 1. Check OTP Logic
        if (otpStore[cleanPhone] && otpStore[cleanPhone] == otp) {

            // 2. Database mein enquiry save karna
            const newLead = await Lead.create({
                customerName,
                customerPhone: cleanPhone,
                category,
                area,
                description, // Frontend mein 'purpose'
                fullAddress
            });

            // 3. 🔥 MATCHING VENDORS NOTIFICATION
            const matchingVendors = await Vendor.find({ category, area });
            matchingVendors.forEach(v => {
                console.log(`🚀 NOTIFICATION: Naya grahak ${area} mein mila! ${v.shopName} ko inform kiya.`);
            });

            // OTP use hone ke baad delete karein
            delete otpStore[cleanPhone];

            res.status(201).json({
                message: `Verified! Lead Generated. Patna ke ${matchingVendors.length} vendors ko notify kiya gaya.`,
                lead: newLead
            });
        } else {
            res.status(400).json({ message: "Galti! OTP galat hai ya expire ho gaya." });
        }
    } catch (err) {
        console.error("Verify Lead Error:", err);
        res.status(500).json({ message: "Verification process fail ho gayi." });
    }
};

// ==========================================
// 3. सभी Leads की सूची (For Admin Dashboard)
// ==========================================
exports.getAllLeads = async (req, res) => {
    try {
        const leads = await Lead.find()
            .populate('category')
            .sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};