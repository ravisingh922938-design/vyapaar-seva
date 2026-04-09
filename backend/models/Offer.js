const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    title: { type: String, required: true }, // e.g., "Holi Special Offer"
    description: { type: String },
    discountValue: { type: String }, // e.g., "20% OFF" ya "Flat ₹500"
    expiryDate: { type: Date },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Offer', OfferSchema);