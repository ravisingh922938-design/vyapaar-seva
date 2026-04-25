const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// --- 1. ROUTES IMPORT ---
const categoryRoutes = require('./routes/categoryRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const leadRoutes = require('./routes/leadRoutes');

const app = express();

// --- 2. MIDDLEWARES & CORS ---
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// --- 3. UPLOADS FOLDER SETUP ---
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static(uploadDir));

// --- 4. API ROUTES MAPPING ---
app.use('/api/categories', categoryRoutes); 
app.use('/api/vendors', vendorRoutes);       
app.use('/api/leads', leadRoutes);           

// Welcome Route
app.get('/', (req, res) => {
    res.send('<h1 style="text-align:center; color:blue; font-family:sans-serif; margin-top:50px;">🚀 Vyapaar Seva Live API is Running!</h1>');
});

// --- 5. DATABASE CONNECTION (ULTIMATE FIXED) ---
// मंतु भाई, लिंक को हमेशा " " के अंदर रखना चाहिए। यहाँ मैंने सही कर दिया है।
const MONGO_URI = "mongodb://vister:mantu12345@ac-3tg1ay7-shard-00-00.pusq8bm.mongodb.net:27017,ac-3tg1ay7-shard-00-01.pusq8bm.mongodb.net:27017,ac-3tg1ay7-shard-00-02.pusq8bm.mongodb.net:27017/vyapaarseva?ssl=true&replicaSet=atlas-m4pv0c-shard-0&authSource=admin&appName=Cluster0";

mongoose.connect(MONGO_URI, {
    connectTimeoutMS: 30000, // 30 सेकंड का समय
    socketTimeoutMS: 45000,
})
.then(() => {
    console.log("------------------------------------------");
    console.log("✅ MongoDB Connected Successfully!");
    console.log("------------------------------------------");
})
.catch(err => {
    console.error("❌ अभी भी एरर है: ", err.message);
    console.log("\n💡 मंतु भाई: अगर अभी भी 'Whitelist' एरर आए, तो मोंगोडीबी एटलस में 0.0.0.0/0 को फिर से डिलीट करके ऐड करें।");
});
  
// --- 6. SERVER START ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n------------------------------------------`);
    console.log(`🚀 VYAPAAR SEVA SERVER IS LIVE!`);
    console.log(`📡 Local Access: http://localhost:${PORT}`);
    console.log(`📡 Live Access: https://api.vister.in`);
    console.log(`------------------------------------------\n`);
});