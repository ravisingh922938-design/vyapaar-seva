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
// 1. VENDOR AUTH & PROFILE (Sellers / Dukandar)
// ============================================================
router.get('/', vendorController.getAllVendors);
router.get('/search', vendorController.searchVendors);
router.get('/:id', vendorController.getVendorDetails);
router.post('/register', upload.single('image'), vendorController.registerVendor);

// 🔑 SELLER LOGIN (For Dukandar)
router.post('/login', vendorController.loginVendor); 

router.put('/update-profile/:id', vendorController.updateProfile);
router.post('/submit-kyc', vendorController.submitKYC);

// ============================================================
// 2. WALLET & FINANCE
// ============================================================
router.get('/wallet/:id', vendorController.getWalletBalance);
router.put('/recharge/:id', vendorController.addMoney);
router.post('/recharge/create-order', vendorController.initiateRecharge);
router.post('/recharge/verify', vendorController.verifyAndAddMoney);
router.get('/transactions/:vendorId', vendorController.getTransactions);
router.get('/pl-summary/:vendorId', vendorController.getProfitLoss);

// ============================================================
// 3. SALESMAN CRM TOOLS (Digital Diary, Payouts & Pool)
// ============================================================
// 📝 SALESMAN AUTH
router.post('/salesman/join', salesCtrl.registerSalesman); // रजिस्ट्रेशन

// 🔑 SALESMAN LOGIN (ये लाइन अब सही जगह पर है)
router.post('/salesman/login', salesCtrl.loginSalesman); 

router.post('/add-note', salesCtrl.addSalesNote);
router.post('/payout-reset', salesCtrl.resetSalesmanWallet);

// ✅ SALESMAN POOL
router.get('/sales-pool', salesCtrl.getAvailablePool);
router.post('/claim-lead', salesCtrl.claimLead);
router.post('/release-lead', salesCtrl.releaseLead);
router.get('/my-targets/:salesmanId', salesCtrl.getMyTargets);

// ============================================================
// 4. LEAD & CRM MANAGEMENT
// ============================================================
router.post('/unlock-lead', vendorController.unlockLead);
router.post('/send-quote', vendorController.sendQuote);
router.post('/update-lead-status', vendorController.updateLeadStatus);
router.get('/tracked-leads/:vendorId', vendorController.getTrackedLeads);

// ============================================================
// 5. BUSINESS SUPER TOOLS
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
// 6. CUSTOMER SIDE ENQUIRY (Leads)
// ============================================================
router.post('/send-otp', leadController.sendOTP);
router.post('/verify-lead', leadController.verifyAndCreateLead);

module.exports = router;