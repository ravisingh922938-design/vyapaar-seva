const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
    // --- 1. BASIC & AUTH INFO ---
    name: { type: String, required: true },
    shopName: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    pincode: { type: String, required: true }, // लीड फ़िल्टर के लिए

    // --- 2. CATEGORY & LOCATION (ALL INDIA FIX) ---
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    area: { type: String, required: true }, // Locality
    city: { type: String },    // ✅ नया: इसे जोड़ना ज़रूरी था
    state: { type: String },   // ✅ नया: इसे जोड़ना ज़रूरी था
    fullAddress: { type: String }, 
    shopImage: { type: String, default: "" },

    // --- 3. SALESMAN MANAGEMENT ---
    assignedSalesman: { type: mongoose.Schema.Types.ObjectId, ref: 'Salesman', default: null },
    isClaimed: { type: Boolean, default: false },
    salesNotes: [{
        note: { type: String },
        salesmanId: { type: String },
        salesmanName: { type: String },
        date: { type: Date, default: Date.now }
    }],

    // --- 4. WALLET & STATUS ---
    walletBalance: { type: Number, default: 0 },
    hasRecharged: { type: Boolean, default: false },
    lastRechargeDate: { type: Date },
    isVerified: { type: Boolean, default: false },
    visterScore: { type: Number, default: 50 },

    // --- 5. MEMBERSHIP & KYC ---
    membershipPlan: { type: String, enum: ['Free', 'Gold', 'Platinum'], default: 'Free' },
    isPromoted: { type: Boolean, default: false },
    kycStatus: { type: String, enum: ['Not Submitted', 'Pending', 'Verified', 'Rejected'], default: 'Not Submitted' },
    documents: {
        aadhaarNumber: { type: String },
        panNumber: { type: String },
        businessLicense: { type: String }
    },

    // --- 6. CATALOG & SEARCH KEYWORDS ---
    referralCode: { type: String, unique: true },
    referredBy: { type: String },
    description: { type: String, default: "Quality service provider." },
    businessHours: { type: String, default: "9:00 AM - 8:00 PM" },
    website: { type: String, default: "" },
    images: [{ type: String }],
    services: [{
        serviceName: { type: String },
        price: { type: Number },
        description: { type: String }
    }],
    
    // ✅ मंतु भाई, यहाँ कीवर्ड्स का एरे (Array) बिल्कुल सही है
    keywords: [{ type: String }], 

    // --- 7. ANALYTICS ---
    profileViews: { type: Number, default: 0 },
    totalCalls: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

// 🔥 मंतु भाई, ये लाइन सबसे ज़रूरी है! 
// यह सर्च को १० गुना फ़ास्ट बना देगी (Index)
VendorSchema.index({ shopName: 'text', keywords: 'text', area: 'text', city: 'text' });

module.exports = mongoose.model('Vendor', VendorSchema);