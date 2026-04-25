const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
    // --- बेसिक जानकारी ---
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // लॉगिन के लिए ज़रूरी
    password: { type: String, required: true },           // लॉगिन के लिए ज़रूरी
    phone: { type: String, required: true, unique: true },
    
    // --- दुकान की जानकारी ---
    shopName: { type: String },
    description: { type: String },
    image: { type: String }, // फोटो का रास्ता (Path)
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, 

    // --- लोकेशन (All India Fix) ---
    area: { type: String },    // अब यह Error नहीं देगा क्योंकि required: true नहीं है
    pincode: { type: String }, // अब यह Error नहीं देगा
    city: { type: String },
    state: { type: String },
    fullAddress: { type: String },

    // --- सिस्टम की जानकारी ---
    walletBalance: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vendor', VendorSchema);