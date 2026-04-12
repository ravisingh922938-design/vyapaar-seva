const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
    // --- 1. BASIC REGISTRATION INFO ---
    name: {
        type: String,
        required: true
    },
    shopName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    // ✅ EMAIL (Naya Field - Login ke liye)
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    // ✅ PASSWORD (Naya Field - Hashed form me save hoga)
    password: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    area: {
        type: String,
        required: true
    },

    // --- PHOTO INFO ---
    shopImage: {
        type: String,
        default: ""
    },

    // --- 2. WALLET & VERIFICATION ---
    walletBalance: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    visterScore: {
        type: Number,
        default: 50
    },

    // --- 3. MEMBERSHIP & PROMOTION ---
    membershipPlan: {
        type: String,
        enum: ['Free', 'Gold', 'Platinum'],
        default: 'Free'
    },
    isPromoted: {
        type: Boolean,
        default: false
    },

    // --- 4. KYC & DOCUMENTS ---
    kycStatus: {
        type: String,
        enum: ['Not Submitted', 'Pending', 'Verified', 'Rejected'],
        default: 'Not Submitted'
    },
    documents: {
        aadhaarNumber: { type: String },
        panNumber: { type: String },
        businessLicense: { type: String }
    },

    // --- 5. REFERRAL SYSTEM ---
    referralCode: {
        type: String,
        unique: true
    },
    referredBy: {
        type: String
    },
    totalReferrals: {
        type: Number,
        default: 0
    },

    // --- 6. ADVANCED PROFILE & CATALOG ---
    description: {
        type: String,
        default: "Patna's best service provider."
    },
    address: {
        type: String,
        default: ""
    },
    businessHours: {
        type: String,
        default: "9:00 AM - 8:00 PM"
    },
    website: {
        type: String,
        default: ""
    },
    images: [{
        type: String
    }],

    services: [{
        serviceName: { type: String },
        price: { type: Number },
        description: { type: String }
    }],

    keywords: [{
        type: String
    }],

    // --- 7. ANALYTICS ---
    profileViews: {
        type: Number,
        default: 0
    },
    totalCalls: {
        type: Number,
        default: 0
    },

    // --- 8. SYSTEM INFO ---
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Vendor', VendorSchema);