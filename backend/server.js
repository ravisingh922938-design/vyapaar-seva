const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// 1. Routes Import (Ek hi baar)
const categoryRoutes = require('./routes/categoryRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const leadRoutes = require('./routes/leadRoutes');

const app = express();

// 2. CORS Settings
app.use(cors({ origin: "*" }));
app.use(express.json());

// 3. Static Folder
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use('/uploads', express.static(uploadDir));

// 4. API Routes Mapping
app.use('/api/categories', categoryRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/leads', leadRoutes); // Iska matlab /api/leads par leadRoutes chalega

// Root Route
app.get('/', (req, res) => {
    res.send('<h1 style="text-align:center; color:blue;">🚀 Vyapaar Seva API is Running!</h1>');
});

// 5. MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected!"))
    .catch(err => console.error("❌ MongoDB Error: ", err));

// 6. Server Start
const PORT = process.env.PORT || 5000;
const CURRENT_IP = "10.44.111.238";

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server started on http://${CURRENT_IP}:${PORT}`);
});