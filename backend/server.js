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
// origin: "*" taaki aapka localhost aur live domain dono se data aaye
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// --- 3. UPLOADS FOLDER SETUP ---
// Agar uploads folder nahi hai toh ye code khud bana dega
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static(uploadDir));

// --- 4. API ROUTES MAPPING ---
// Mantu bhai, ye raaste ekdum dhyan se dekhiye:
app.use('/api/categories', categoryRoutes); // Raasta: /api/categories
app.use('/api/vendors', vendorRoutes);       // Raasta: /api/vendors (Register/Login isi me hain)
app.use('/api/leads', leadRoutes);           // Raasta: /api/leads (Enquiry isi me hai)

// Welcome Route (Check karne ke liye ki server chalu hai)
app.get('/', (req, res) => {
    res.send('<h1 style="text-align:center; color:blue; font-family:sans-serif; margin-top:50px;">🚀 Vyapaar Seva Live API is Running!</h1>');
});

// --- 5. DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error: ", err.message);
    });

// --- 6. SERVER START ---
const PORT = process.env.PORT || 5000;

// '0.0.0.0' Render.com ke liye zaroori hai
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n------------------------------------------`);
    console.log(`🚀 VYAPAAR SEVA SERVER IS LIVE!`);
    console.log(`📡 Local Access: http://localhost:${PORT}`);
    console.log(`📡 Live Access: https://api.vister.in`);
    console.log(`------------------------------------------\n`);
});