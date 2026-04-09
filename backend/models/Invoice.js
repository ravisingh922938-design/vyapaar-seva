const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    items: [{
        name: String,
        price: Number,
        qty: Number
    }],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['Paid', 'Unpaid'], default: 'Paid' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Invoice', InvoiceSchema);