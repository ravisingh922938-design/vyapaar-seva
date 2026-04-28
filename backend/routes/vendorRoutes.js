const express = require('express');
const router = express.Router();
const multer = require('multer');

// --- 🎮 CONTROLLERS IMPORT ---
const vendorController = require('../controllers/vendorController');
const leadController = require('../controllers/leadController');
const salesCtrl = require('../controllers/salesController');

// Photo upload setup
const upload = multer({ dest: 'uploads/' });

// ============================================================
// 1. VENDOR SEARCH & LISTING (SABSE UPAR)
// ============================================================
// ✅ मंतु भाई, '/search' हमेशा '/:id' के ऊपर होना चाहिए। यहाँ एकदम सही है।
router.get('/search', vendorController.searchVendors);
router.get('/', vendorController.getAllVendors);

// ============================================================
// 2. VENDOR AUTH & PROFILE (Sellers)
// ============================================================
router.post('/register', upload.single('image'), vendorController.registerVendor);
router.post('/login', vendorController.loginVendor); 
router.put('/update-profile/:id', vendorController.updateProfile);
router.post('/submit-kyc', vendorController.submitKYC);
router.put('/update-keywords/:id', vendorController.updateKeywords);

// ============================================================
// 3. WALLET & FINANCE
// ============================================================
router.get('/wallet/:id', vendorController.getWalletBalance);
router.put('/recharge/:id', vendorController.addMoney);
router.post('/recharge/create-order', vendorController.initiateRecharge);
router.post('/recharge/verify', vendorController.verifyAndAddMoney);
router.get('/transactions/:vendorId', vendorController.getTransactions);
router.get('/pl-summary/:vendorId', vendorController.getProfitLoss);

// ============================================================
// 4. SALESMAN CRM TOOLS
// ============================================================
router.post('/salesman/join', salesCtrl.registerSalesman); 
router.post('/salesman/login', salesCtrl.loginSalesman); 
router.post('/add-note', salesCtrl.addSalesNote);
router.post('/payout-reset', salesCtrl.resetSalesmanWallet);
router.get('/sales-pool', salesCtrl.getAvailablePool);
router.post('/claim-lead', salesCtrl.claimLead);
router.post('/release-lead', salesCtrl.releaseLead);
router.get('/my-targets/:salesmanId', salesCtrl.getMyTargets);

// ============================================================
// 5. LEAD & CRM MANAGEMENT
// ============================================================
router.post('/unlock-lead', vendorController.unlockLead);
router.post('/send-quote', vendorController.sendQuote);
router.post('/update-lead-status', vendorController.updateLeadStatus);
router.get('/tracked-leads/:vendorId', vendorController.getTrackedLeads);

// ============================================================
// 6. BUSINESS SUPER TOOLS
// ============================================================
router.get('/stats/:id', vendorController.getBusinessStats);
router.get('/reviews/:vendorId', vendorController.getVendorReviews);
router.post('/reviews/add', vendorController.addReview);
router.post('/create-offer', vendorController.createOffer);
router.post('/create-invoice', vendorController.createInvoice);
router.get('/my-invoices/:vendorId', vendorController.getInvoices);
router.post('/add-expense', vendorController.addExpense);
router.post('/issue-warranty', vendorController.issueWarranty);
router.post('/add-staff', vendorController.addStaff);
router.get('/my-staff/:vendorId', vendorController.getStaffList);
router.post('/create-booking', vendorController.createBooking);
router.get('/my-bookings/:vendorId', vendorController.getMyBookings);
router.get('/marketing-audience/:vendorId', vendorController.getMarketingAudience);

// ============================================================
// 7. CUSTOMER SIDE ENQUIRY (Leads)
// ============================================================
router.post('/send-otp', leadController.sendOTP);
router.post('/verify-lead', leadController.verifyAndCreateLead);

// ============================================================
// 8. INDIVIDUAL VENDOR DETAILS (SABSE NEECHE)
// ============================================================
// ❌ अगर ये ऊपर होगा तो '/search' को भी ID समझ लेगा। इसलिए इसे नीचे ही रहने दें।
router.get('/:id', vendorController.getVendorDetails);

module.exports = router;