const express = require('express');
const router = express.Router();
const multer = require('multer');
const vendorController = require('../controllers/vendorController');

const upload = multer({ dest: 'uploads/' });

// --- AUTH & PROFILE ---
router.get('/', vendorController.getAllVendors);
router.get('/search', vendorController.searchVendors);
router.get('/:id', vendorController.getVendorDetails);
router.post('/register', upload.single('image'), vendorController.registerVendor);
router.post('/login-otp', vendorController.sendLoginOTP);
router.post('/verify-login', vendorController.verifyLogin);
router.put('/update-profile/:id', vendorController.updateProfile);
router.post('/submit-kyc', vendorController.submitKYC);

// --- WALLET & RECHARGE ---
router.get('/wallet/:id', vendorController.getWalletBalance);
router.put('/recharge/:id', vendorController.addMoney);
router.post('/recharge/create-order', vendorController.initiateRecharge);
router.post('/recharge/verify', vendorController.verifyAndAddMoney);
router.get('/transactions/:vendorId', vendorController.getTransactions);

// --- CRM & LEADS ---
router.post('/unlock-lead', vendorController.unlockLead);
router.post('/send-quote', vendorController.sendQuote);
router.post('/update-lead-status', vendorController.updateLeadStatus);
router.get('/tracked-leads/:vendorId', vendorController.getTrackedLeads);

// --- BUSINESS OPS ---
router.get('/stats/:id', vendorController.getBusinessStats);
router.get('/reviews/:vendorId', vendorController.getVendorReviews);
router.post('/reviews/add', vendorController.addReview);
router.post('/create-offer', vendorController.createOffer);
router.get('/my-offers/:vendorId', vendorController.getVendorOffers);
router.post('/create-invoice', vendorController.createInvoice);
router.get('/my-invoices/:vendorId', vendorController.getInvoices);
router.post('/add-expense', vendorController.addExpense);
router.get('/pl-summary/:vendorId', vendorController.getProfitLoss);

// --- SERVICES & SUPPORT ---
router.post('/apply-loan', vendorController.applyForLoan);
router.post('/tax-service', vendorController.applyForTaxService);
router.post('/add-staff', vendorController.addStaff);
router.get('/my-staff/:vendorId', vendorController.getStaffList);
router.post('/create-booking', vendorController.createBooking);
router.get('/my-bookings/:vendorId', vendorController.getMyBookings);
router.post('/issue-warranty', vendorController.issueWarranty);
router.post('/support', vendorController.createSupportTicket);
router.post('/upgrade-request', vendorController.requestUpgrade);
router.get('/marketing-audience/:vendorId', vendorController.getMarketingAudience);

module.exports = router;