const mongoose = require('mongoose');

const SalesmanSchema = new mongoose.Schema({
    // --- 1. BASIC IDENTITY (Registration Info) ---
    name: {
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
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    empId: {
        type: String,
        unique: true,
        required: true
    }, // Example: VS-2026-01
    photo: {
        type: String,
        default: ""
    }, // Salesman ki profile photo ka path
    designation: {
        type: String,
        default: "Field Sales Executive"
    },
    area: {
        type: String,
        required: true
    }, // Patna, Gaya, etc.

    // --- 2. WALLET & COMMISSION (Paisa aur Referral) ---
    walletBalance: {
        type: Number,
        default: 0
    },
    referralCode: {
        type: String,
        unique: true
    }, // Is code se Sellers register honge

    // --- 3. BANK DETAILS (Monday Payout ke liye) ---
    bankDetails: {
        accountNumber: { type: String, default: "" },
        ifscCode: { type: String, default: "" },
        upiId: { type: String, default: "" }
    },

    // --- 4. KYC DETAILS (Security & Trust) ---
    kycDetails: {
        aadhaarNumber: { type: String, default: "" },
        panNumber: { type: String, default: "" },
        address: { type: String, default: "" },
        aadhaarPhoto: { type: String, default: "" }, // Document Image Path
        panPhoto: { type: String, default: "" },     // Document Image Path
        status: {
            type: String,
            enum: ['Not Submitted', 'Pending', 'Verified', 'Rejected'],
            default: 'Not Submitted'
        }
    },

    // --- 5. SYSTEM STATS ---
    isVerified: {
        type: Boolean,
        default: false
    }, // Admin manual verify karega
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Salesman', SalesmanSchema);