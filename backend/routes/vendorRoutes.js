const express = require('express');
const router = express.Router();
const multer = require('multer');

// Controllers Import
const vendorController = require('../controllers/vendorController');
const leadController = require('../controllers/leadController');

// Photo upload configuration
const upload = multer({ dest: 'uploads/' });

// ============================================================
// 1. VENDOR AUTH & PROFILE (Email/Password Login)
// ============================================================
router.get('/', vendorController.getAllVendors);
router.get('/search', vendorController.searchVendors);
router.get('/:id', vendorController.getVendorDetails);

// Registration with Photo Upload
router.post('/register', upload.single('image'), vendorController.registerVendor);

// ✅ FINAL LOGIN ROUTE (Sirf ek baar)
// URL: http://localhost:5000/api/api/vendors/login
router.post('/login', vendorController.loginVendor);
// Profile & KYC
router.put('/update-profile/:id', vendorController.updateProfile);
router.post('/submit-kyc', vendorController.submitKYC);

// ============================================================
// 2. WALLET & RECHARGE
// ============================================================
router.get('/wallet/:id', vendorController.getWalletBalance);
router.put('/recharge/:id', vendorController.addMoney);
router.post('/recharge/create-order', vendorController.initiateRecharge);
router.post('/recharge/verify', vendorController.verifyAndAddMoney);
router.get('/transactions/:vendorId', vendorController.getTransactions);

// ============================================================
// 3. CRM & LEADS MANAGEMENT
// ============================================================
router.post('/unlock-lead', vendorController.unlockLead);
router.post('/send-quote', vendorController.sendQuote);
router.post('/update-lead-status', vendorController.updateLeadStatus);
router.get('/tracked-leads/:vendorId', vendorController.getTrackedLeads);
router.get('/marketing-audience/:vendorId', vendorController.getMarketingAudience);

// ============================================================
// 4. BUSINESS OPERATIONS & STATS
// ============================================================
router.get('/stats/:id', vendorController.getBusinessStats);
router.get('/reviews/:vendorId', vendorController.getVendorReviews);
router.post('/reviews/add', vendorController.addReview);
router.post('/create-offer', vendorController.createOffer);
router.get('/my-offers/:vendorId', vendorController.getVendorOffers);
router.post('/create-invoice', vendorController.createInvoice);
router.get('/my-invoices/:vendorId', vendorController.getInvoices);
router.get('/pl-summary/:vendorId', vendorController.getProfitLoss);

// ============================================================
// 5. SERVICES & STAFF
// ============================================================
router.post('/apply-loan', vendorController.applyForLoan);
router.post('/tax-service', vendorController.applyForTaxService);
router.post('/add-staff', vendorController.addStaff);
router.get('/my-staff/:vendorId', vendorController.getStaffList);
router.post('/create-booking', vendorController.createBooking);
router.get('/my-bookings/:vendorId', vendorController.getMyBookings);
router.post('/issue-warranty', vendorController.issueWarranty);
router.post('/support', vendorController.createSupportTicket);
router.post('/upgrade-request', vendorController.requestUpgrade);

// ============================================================
// 6. CUSTOMER SIDE ENQUIRY (Bina OTP wala system)
// ============================================================
// Iska raasta server.js me /api/leads par mapped hai
router.post('/send-otp', leadController.sendOTP);
router.post('/verify-lead', leadController.verifyAndCreateLead);

module.exports = router;