const mongoose = require('mongoose');

const LeadTrackerSchema = new mongoose.Schema({
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
    status: {
        type: String,
        enum: ['New', 'Spoke to Customer', 'Meeting Fixed', 'Deal Closed', 'Not Interested'],
        default: 'New'
    },
    notes: { type: String, default: "" }, // Dukaandaar ki choti tippani
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LeadTracker', LeadTrackerSchema);