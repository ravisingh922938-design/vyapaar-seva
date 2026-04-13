const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
    // --- 1. BASIC & AUTH INFO ---
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
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    }, // 🔥 Pincode wise lead filtering ke liye zaroori hai

    // --- 2. CATEGORY & LOCATION ---
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    area: {
        type: String,
        required: true
    },
    shopImage: {
        type: String,
        default: ""
    },

    // --- 3. SALESMAN MANAGEMENT (Claim & Note System) ---
    // ✅ SALESMAN HELP: Kaunsa boy is dukan ko sambhal raha hai
    assignedSalesman: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Salesman',
        default: null
    },
    // ✅ Pata chalega dukan pool me hai ya kisi ne lock kar li hai
    isClaimed: {
        type: Boolean,
        default: false
    },
    // ✅ DIGITAL NOTEPAD: Salesman aur Seller ki baatchit ka record
    salesNotes: [{
        note: { type: String },
        salesmanId: { type: String },
        salesmanName: { type: String },
        date: { type: Date, default: Date.now }
    }],

    // --- 4. WALLET & RECHARGE STATUS ---
    walletBalance: {
        type: Number,
        default: 0
    },
    // Pata chalega dukan ne kabhi asli paisa diya ya nahi
    hasRecharged: {
        type: Boolean,
        default: false
    },
    lastRechargeDate: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    visterScore: {
        type: Number,
        default: 50
    },

    // --- 5. MEMBERSHIP & KYC ---
    membershipPlan: {
        type: String,
        enum: ['Free', 'Gold', 'Platinum'],
        default: 'Free'
    },
    isPromoted: {
        type: Boolean,
        default: false
    },
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

    // --- 6. REFERRAL & CATALOG ---
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
    images: [{ type: String }],
    services: [{
        serviceName: { type: String },
        price: { type: Number },
        description: { type: String }
    }],
    keywords: [{ type: String }],

    // --- 7. ANALYTICS & SYSTEM ---
    profileViews: {
        type: Number,
        default: 0
    },
    totalCalls: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Vendor', VendorSchema);