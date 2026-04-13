const Vendor = require('../models/Vendor');
const Transaction = require('../models/Transaction');
const bcrypt = require('bcryptjs'); // Password secure karne ke liye
const jwt = require('jsonwebtoken');

// ============================================================
// 1. SELLER REGISTRATION (Photo + Email/Pass + Salesman Logic)
// ============================================================
exports.registerVendor = async (req, res) => {
    try {
        const { name, shopName, phone, email, password, category, area, pincode, description, referredBy, salesmanId } = req.body;

        // 📸 Photo check (Multer se aayegi)
        const imagePath = req.file ? req.file.filename : "";

        // 🛡️ Phone number clean karein
        const cleanPhone = phone.replace(/\D/g, '').slice(-10);

        // 🔍 Check karein ki user pehle se hai ya nahi
        const existingVendor = await Vendor.findOne({ $or: [{ phone: cleanPhone }, { email: email.toLowerCase() }] });
        if (existingVendor) return res.status(400).json({ status: "error", message: "Mobile ya Email pehle se register hai!" });

        // 🔐 Password secure karein
        const hashedPassword = await bcrypt.hash(password, 10);

        const myReferralCode = "VISTER" + Math.floor(1000 + Math.random() * 9000);

        const newVendor = new Vendor({
            name,
            shopName,
            phone: cleanPhone,
            email: email.toLowerCase(),
            password: hashedPassword,
            category,
            area,
            pincode,
            description: description || "Patna local expert.",
            shopImage: imagePath, // Photo path save ho raha hai
            walletBalance: 0,
            referralCode: myReferralCode,
            referredBy: referredBy || "",
            // 🔥 Salesman Logic: Agar salesman ne add kiya hai toh auto-claim kar do
            assignedSalesman: salesmanId || null,
            isClaimed: salesmanId ? true : false
        });

        await newVendor.save();

        // 💰 Referral Bonus logic (Agar kisi ke link se aaya hai)
        if (referredBy) {
            const referrer = await Vendor.findOne({ referralCode: referredBy });
            if (referrer) {
                referrer.walletBalance += 100;
                referrer.totalReferrals += 1;
                await referrer.save();
                await Transaction.create({
                    vendorId: referrer._id,
                    amount: 100,
                    type: 'credit',
                    description: `Referral Bonus: ${name} Joined`
                });
            }
        }

        res.status(201).json({
            status: "success",
            message: "Vendor Registered Successfully!",
            vendor: newVendor
        });
    } catch (error) {
        console.error("Reg Error:", error.message);
        res.status(500).json({ status: "error", message: error.message });
    }
};

// ============================================================
// 2. SELLER LOGIN (Email & Password)
// ============================================================
exports.loginVendor = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email aur Password dono chahiye!" });

        const seller = await Vendor.findOne({ email: email.toLowerCase() });
        if (!seller) return res.status(404).json({ status: "error", message: "Email registered nahi hai!" });

        const isMatch = await bcrypt.compare(password, seller.password);
        if (!isMatch) return res.status(400).json({ status: "error", message: "Galti! Password galat hai." });

        const token = jwt.sign(
            { id: seller._id },
            process.env.JWT_SECRET || 'vister_secret_key',
            { expiresIn: '7d' }
        );

        res.status(200).json({
            status: "success",
            token,
            seller: { id: seller._id, shopName: seller.shopName, email: seller.email }
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: "Login Fail" });
    }
};

// ============================================================
// 3. SEARCH & PROFILE FUNCTIONS
// ============================================================
exports.getVendorDetails = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id).populate('category').select('-password');
        if (!vendor) return res.status(404).json({ message: "Vendor not found!" });
        vendor.profileViews += 1;
        await vendor.save();
        res.json(vendor);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.searchVendors = async (req, res) => {
    try {
        const { query, area, categoryId } = req.query;
        let filter = {};
        if (categoryId) filter.category = categoryId;
        if (area) filter.area = area;
        if (query) filter.shopName = { $regex: query, $options: 'i' };

        const vendors = await Vendor.find(filter).sort({ isVerified: -1 });
        res.json(vendors);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate('category').select('-password');
        res.json(vendors);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.updateProfile = async (req, res) => {
    try {
        const updated = await Vendor.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json({ status: "success", vendor: updated });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.submitKYC = async (req, res) => {
    try {
        const updated = await Vendor.findByIdAndUpdate(req.body.vendorId, { kycStatus: 'Pending' }, { new: true });
        res.json({ status: "success", message: "KYC Pending Review" });
    } catch (err) { res.status(500).json({ message: err.message }); }
};