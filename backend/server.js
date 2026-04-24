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
    // --- 5. DATABASE CONNECTION (FIXED) ---
// मंतु भाई, यहाँ लिंक डायरेक्ट डाल दें ताकि सर्वर क्रैश न हो
const MONGO_URI = "mongodb+srv://vister:-vister12345@cluster0.pusq8bm.mongodb.net/VyapaarSeva?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("------------------------------------------");
        console.log("✅ MongoDB Connected Successfully!");
        console.log("------------------------------------------");
    })
    .catch(err => {
        console.error("❌ MongoDB Connection Error: ", err.message);
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