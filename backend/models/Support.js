const mongoose = require('mongoose');

const SupportSchema = new mongoose.Schema({
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    issueType: { type: String, enum: ['Recharge Issue', 'Fake Lead', 'App Bug', 'Other'], required: true },
    message: { type: String, required: true },
    status: { type: String, default: 'Pending' }, // Pending, Resolved
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Support', SupportSchema);