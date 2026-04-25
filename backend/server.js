const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // ✅ सबसे ऊपर: ये .env से सारा डेटा लोड करेगा
const fs = require('fs');
const path = require('path');

// --- 🎮 ROUTES IMPORT ---
const categoryRoutes = require('./routes/categoryRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const leadRoutes = require('./routes/leadRoutes');

const app = express();

// --- 🛡️ MIDDLEWARES & CORS ---
// मंतु भाई, यहाँ origin: "*" रखा है ताकि वेबसाइट और ऐप्स से डेटा आने में कोई दिक्कत न हो
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// --- 📁 UPLOADS FOLDER SETUP ---
// दुकान की फोटो सेव करने के लिए फोल्डर ऑटो-क्रिएट होगा
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static(uploadDir));

// --- 🚀 API ROUTES MAPPING ---
app.use('/api/categories', categoryRoutes); 
app.use('/api/vendors', vendorRoutes);       
app.use('/api/leads', leadRoutes);           

// Welcome Route (सर्वर चेक करने के लिए)
app.get('/', (req, res) => {
    res.send('<h1 style="text-align:center; color:blue; font-family:sans-serif; margin-top:50px;">🚀 Vyapaar Seva Live API is Running!</h1>');
});

// --- 💾 DATABASE CONNECTION ---
// मंतु भाई, पक्का करें कि आपकी .env फाइल में MONGO_URI बिल्कुल सही है
const dbLink = process.env.MONGO_URI;

mongoose.connect(dbLink, {
    connectTimeoutMS: 30000, // ३० सेकंड तक इंतज़ार करेगा
    socketTimeoutMS: 45000,
})
.then(() => {
    console.log("------------------------------------------");
    console.log("✅ MongoDB Connected Successfully!");
    console.log("📁 Database: vyapaarseva");
    console.log("------------------------------------------");
})
.catch(err => {
    console.error("❌ MongoDB Connection Error: ", err.message);
    console.log("\n💡 टिप: अगर एरर आए, तो मोंगोडीबी एटलस में 0.0.0.0/0 (Whitelist) चेक करें।");
});
  
// --- ⚡ SERVER START ---
const PORT = process.env.PORT || 5000;

// '0.0.0.0' रेंडर और वर्सेल के लिए ज़रूरी है
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n------------------------------------------`);
    console.log(`🚀 VYAPAAR SEVA SERVER IS LIVE!`);
    console.log(`📡 Local Access: http://localhost:${PORT}`);
    console.log(`📡 Live API: https://api.vister.in/api`);
    console.log(`------------------------------------------\n`);
});