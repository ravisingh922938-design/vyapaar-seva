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
// --- 5. DATABASE CONNECTION (ULTIMATE FIX) ---
// मंतु भाई, यह 'Standard Link' है, इसमें SRV की समस्या नहीं आती।
const MONGO_URI = "mongodb://vister:-vister12345@cluster0-shard-00-00.pusq8bm.mongodb.net:27017,cluster0-shard-00-01.pusq8bm.mongodb.net:27017,cluster0-shard-00-02.pusq8bm.mongodb.net:27017/VyapaarSeva?ssl=true&replicaSet=atlas-pusq8bm-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(MONGO_URI, {
    connectTimeoutMS: 20000, // 20 सेकंड तक कोशिश करे
    socketTimeoutMS: 45000,
})
.then(() => {
    console.log("------------------------------------------");
    console.log("✅ MongoDB Connected Successfully (Standard Link)!");
    console.log("------------------------------------------");
})
.catch(err => {
    console.error("❌ अभी भी एरर है: ", err.message);
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