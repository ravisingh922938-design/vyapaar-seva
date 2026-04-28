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

    // --- 2. CATEGORY (THE ULTIMATE FIX) ---
    // ✅ मंतु भाई, इसे String रखा है ताकि 'm113' या 'temp_1' जैसे Static IDs पर सर्वर क्रैश न हो
    category: { 
        type: String, 
        required: true 
    }, 

    // --- 3. ALL INDIA LOCATION ---
    pincode: { type: String, required: true }, 
    area: { type: String, required: true }, // Locality
    city: { type: String, required: true },    
    state: { type: String, required: true },   
    fullAddress: { type: String }, 
    shopImage: { type: String, default: "" },
    description: { type: String, default: "Quality service provider." },

    // --- 4. SALESMAN & KEYWORDS SYSTEM ---
    keywords: [{ type: String }], // दुकानदार के काम से जुड़े शब्द (Tags)
    assignedSalesman: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Salesman', 
        default: null 
    },
    isClaimed: { 
        type: Boolean, 
        default: false 
    },
    salesNotes: [{
        note: { type: String },
        salesmanName: { type: String },
        date: { type: Date, default: Date.now }
    }],

    // --- 5. WALLET & STATUS ---
    walletBalance: { 
        type: Number, 
        default: 0 
    },
    hasRecharged: { 
        type: Boolean, 
        default: false 
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    },
    referralCode: { 
        type: String 
    },

    // --- 6. ANALYTICS ---
    profileViews: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

// 🔥 मंतु भाई, ये लाइन सर्च को 'Justdial' जैसा पॉवरफुल बना देगी
// यह दुकान के नाम, कीवर्ड्स, शहर और इलाके सबको एक साथ सर्च करेगा
VendorSchema.index({ 
    shopName: 'text', 
    keywords: 'text', 
    city: 'text', 
    area: 'text',
    description: 'text' 
});

module.exports = mongoose.model('Vendor', VendorSchema);