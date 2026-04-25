const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const Lead = require('../models/Lead'); // ✅ १. मॉडल को इम्पोर्ट करना ज़रूरी है

// ============================================================
// 1. CUSTOMER SIDE (Leads बनाना)
// ============================================================

// OTP भेजना
router.post('/send-otp', leadController.sendOTP);

// इंक्वायरी सेव करना (Verify karke)
router.post('/verify-lead', leadController.verifyAndCreateLead);


// ============================================================
// 2. SELLER SIDE (Leads दिखाना)
// ============================================================

// ✅ २. सेलर ऐप के डैशबोर्ड के लिए सही रास्ता
// URL: https://api.vister.in/api/leads/my-leads/CATEGORY_ID
router.get('/my-leads/:categoryId', leadController.getLeadsForSeller);

// वैकल्पिक रास्ता (अगर आप by-category नाम इस्तेमाल करना चाहें)
router.get('/by-category/:catId', async (req, res) => {
    try {
        const leads = await Lead.find({ category: req.params.catId }).sort({ createdAt: -1 });
        res.json({ status: "success", leads: leads });
    } catch (err) { 
        res.status(500).json({ message: "Error loading leads", error: err.message }); 
    }
});


// ============================================================
// 3. ADMIN SIDE (Sare Leads)
// ============================================================
router.get('/', leadController.getAllLeads);

module.exports = router; // ✅ यह हमेशा सबसे नीचे होना चाहिए