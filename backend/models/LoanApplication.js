const mongoose = require('mongoose');

const LoanApplicationSchema = new mongoose.Schema({
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    amountNeeded: { type: Number, required: true },
    purpose: { type: String, required: true }, // e.g., "Dukan badhani hai", "Stock kharidna hai"
    monthlyTurnover: { type: String, required: true }, // e.g., "50k-1 Lakh"
    status: {
        type: String,
        enum: ['Pending', 'Document Collection', 'Bank Review', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LoanApplication', LoanApplicationSchema);