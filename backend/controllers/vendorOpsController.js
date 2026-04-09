const Review = require('../models/Review');
const Staff = require('../models/Staff');
const Booking = require('../models/Booking');
const Warranty = require('../models/Warranty');
const Support = require('../models/Support');
const Offer = require('../models/Offer');
const Vendor = require('../models/Vendor');

exports.getBusinessStats = async (req, res) => {
    try { const v = await Vendor.findById(req.params.id); res.json({ views: v.profileViews }); }
    catch (e) { res.status(500).json(e); }
};

exports.addReview = async (req, res) => {
    try { const r = await Review.create(req.body); res.json(r); } catch (e) { res.status(500).json(e); }
};

exports.getVendorReviews = async (req, res) => {
    try { const r = await Review.find({ vendorId: req.params.vendorId }); res.json(r); }
    catch (e) { res.status(500).json(e); }
};

exports.createOffer = async (req, res) => {
    try { const o = await Offer.create(req.body); res.json(o); } catch (e) { res.status(500).json(e); }
};

exports.getVendorOffers = async (req, res) => {
    try { const o = await Offer.find({ vendorId: req.params.vendorId }); res.json(o); }
    catch (e) { res.status(500).json(e); }
};

exports.addStaff = async (req, res) => {
    try { const s = await Staff.create(req.body); res.json(s); } catch (e) { res.status(500).json(e); }
};

exports.getStaffList = async (req, res) => {
    try { const s = await Staff.find({ vendorId: req.params.vendorId }); res.json(s); }
    catch (e) { res.status(500).json(e); }
};

exports.createBooking = async (req, res) => {
    try { const b = await Booking.create(req.body); res.json(b); } catch (e) { res.status(500).json(e); }
};

exports.getMyBookings = async (req, res) => {
    try { const b = await Booking.find({ vendorId: req.params.vendorId }); res.json(b); }
    catch (e) { res.status(500).json(e); }
};

exports.issueWarranty = async (req, res) => {
    try { const w = await Warranty.create(req.body); res.json(w); } catch (e) { res.status(500).json(e); }
};

exports.createSupportTicket = async (req, res) => {
    try { const s = await Support.create(req.body); res.json(s); } catch (e) { res.status(500).json(e); }
};

exports.requestUpgrade = async (req, res) => {
    try { res.json({ message: "Requested" }); } catch (e) { res.status(500).json(e); }
};