const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const Lead = require('../models/Lead'); // मॉडल इम्पोर्ट

// ============================================================
// 1. CUSTOMER SIDE (Leads बनाना)
// ============================================================
router.post('/send-otp', leadController.sendOTP);
router.post('/verify-lead', leadController.verifyAndCreateLead);

// ============================================================
// 2. SELLER SIDE (Leads दिखाना)
// ============================================================
// ✅ सेलर ऐप के डैशबोर्ड के लिए सही रास्ता (इसे सिर्फ एक बार ऊपर ही लिखना है)
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

// ✅ बस! यहाँ फाइल ख़त्म होनी चाहिए। इसके नीचे 1 भी लाइन का कोड नहीं होना चाहिए।
module.exports = router;