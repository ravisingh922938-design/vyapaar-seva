const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    bookingDate: { type: Date, required: true },
    bookingTime: { type: String, required: true }, // e.g. "04:00 PM"
    status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);