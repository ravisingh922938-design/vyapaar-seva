const mongoose = require('mongoose');

const ComplianceSchema = new mongoose.Schema({
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    serviceType: { type: String, enum: ['GST Return', 'ITR Filing', 'GST Registration', 'Accounting'], required: true },
    status: { type: String, default: 'Pending' }, // Pending, Processing, Completed
    documents: [{ type: String }], // Documents ke URLs (Aadhar, PAN, Bills)
    notes: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Compliance', ComplianceSchema);