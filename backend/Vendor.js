const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    shopName: { type: String },
    phone: { type: String, required: true, unique: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // Filter yahan se hoga
    area: { type: String },
    walletBalance: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model('Vendor', VendorSchema);