const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['credit', 'debit'], required: true }, // credit = recharge, debit = lead unlock
    description: { type: String }, // e.g. "Lead Unlocked: Ravi Kumar"

    // --- NAYE FIELDS (Online Recharge ke liye) ---
    status: {
        type: String,
        enum: ['Pending', 'Success', 'Failed'],
        default: 'Success' // Purani entries Success hi rahengi
    },
    paymentId: { type: String }, // UPI Transaction ID ya Reference No.

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);