const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    area: { type: String, required: true },
    fullAddress: { type: String, required: false }, // <-- New Field
    description: { type: String, required: false },
    unlockedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }],
    maxUnlocks: { type: Number, default: 3 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', LeadSchema);