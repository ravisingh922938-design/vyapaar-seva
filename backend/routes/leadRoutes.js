const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');

// 1. OTP Bhejna
router.post('/send-otp', leadController.sendOTP);

// 2. OTP Verify karke Lead banana
router.post('/verify-lead', leadController.verifyAndCreateLead);

// 3. SARE LEADS DEKHNE KE LIYE (Admin Panel isi ko dhoondh raha hai)
// URL banega: http://api.vister.in/api/leads
router.get('/', leadController.getAllLeads);

module.exports = router;