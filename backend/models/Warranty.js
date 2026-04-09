const mongoose = require('mongoose');

const WarrantySchema = new mongoose.Schema({
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    customerPhone: { type: String, required: true },
    serviceName: { type: String, required: true },
    amountPaid: { type: Number },
    warrantyMonths: { type: Number, default: 3 }, // 3 mahine ki guarantee
    expiryDate: { type: Date },
    status: { type: String, default: 'Active' }, // Active, Expired
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Warranty', WarrantySchema);