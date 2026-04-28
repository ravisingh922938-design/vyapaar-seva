const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
    customerName: { 
        type: String, 
        required: true 
    },
    customerPhone: { 
        type: String, 
        required: true 
    },
    
    // ✅ मंतु भाई, यहाँ सबसे बड़ा सुधार है: 
    // इसे String कर दिया है ताकि "Plumber" या "m113" जैसे नाम आराम से सेव हो सकें
    category: { 
        type: String, 
        required: true 
    }, 

    area: { 
        type: String, 
        required: true 
    },
    pincode: { 
        type: String 
    },
    fullAddress: { 
        type: String, 
        required: false 
    },
    description: { 
        type: String, 
        required: false 
    }, // इसे 'Purpose' के लिए इस्तेमाल करेंगे

    // ✅ वेंडर आईडी स्टोर करने के लिए इसे भी String एरे बना दिया है (Resilient Logic)
    unlockedBy: [{ 
        type: String 
    }],
    
    maxUnlocks: { 
        type: Number, 
        default: 3 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Lead', LeadSchema);