const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, default: 'Technician' }, // e.g. Helper, Senior, Driver
    status: { type: String, enum: ['Available', 'On Field', 'Leave'], default: 'Available' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Staff', StaffSchema);