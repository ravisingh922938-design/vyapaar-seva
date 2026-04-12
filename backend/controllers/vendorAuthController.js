const Vendor = require('../models/Vendor');
const Transaction = require('../models/Transaction');

// ============================================================
// 1. SELLER REGISTRATION (With Photo & Referral)
// ============================================================
exports.registerVendor = async (req, res) => {
    try {
        const { name, shopName, phone, category, area, description, referredBy } = req.body;

        // Photo check (Multer se aayegi)
        const imagePath = req.file ? req.file.filename : "";

        // Check if number already exists
        const existingVendor = await Vendor.findOne({ phone: phone.replace(/\D/g, '').slice(-10) });
        if (existingVendor) return res.status(400).json({ message: "Mobile Number already registered!" });

        const myReferralCode = "VISTER" + Math.floor(1000 + Math.random() * 9000);

        const newVendor = new Vendor({
            name,
            shopName,
            phone: phone.replace(/\D/g, '').slice(-10),
            category,
            area,
            description,
            shopImage: imagePath,
            walletBalance: 0,
            referralCode: myReferralCode,
            referredBy: referredBy || ""
        });

        await newVendor.save();

        // Referral Bonus logic
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
        res.status(500).json({ message: error.message });
    }
};

// ============================================================
// 2. SELLER LOGIN (Bina OTP - Direct Login)
// ============================================================
exports.loginVendor = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) return res.status(400).json({ message: "Phone number zaroori hai!" });

        // Phone number saaf karo aur database me dhundo
        const cleanPhone = phone.replace(/\D/g, '').slice(-10);
        const seller = await Vendor.findOne({ phone: cleanPhone });

        if (seller) {
            console.log(`✅ Seller Logged In: ${seller.shopName}`);
            res.status(200).json({
                status: "success",
                message: "Login Successful!",
                seller
            });
        } else {
            res.status(404).json({
                status: "error",
                message: "Ye number register nahi hai. Pehle Free Listing karein."
            });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// ============================================================
// 3. SEARCH & PROFILE DETAILS
// ============================================================
exports.getVendorDetails = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id).populate('category').select('-walletBalance');
        if (!vendor) return res.status(404).json({ message: "Vendor not found!" });

        vendor.profileViews += 1;
        await vendor.save();
        res.json(vendor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.searchVendors = async (req, res) => {
    try {
        const { query, area, categoryId } = req.query;
        let filter = {};

        if (categoryId) filter.category = categoryId;
        if (area) filter.area = area;
        if (query) {
            filter.$or = [
                { shopName: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ];
        }

        const vendors = await Vendor.find(filter).sort({ isVerified: -1 });
        res.json(vendors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate('category');
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============================================================
// 4. PROFILE UPDATE & KYC
// ============================================================
exports.updateProfile = async (req, res) => {
    try {
        const updatedVendor = await Vendor.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json({ message: "Profile Updated Successfully!", vendor: updatedVendor });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.submitKYC = async (req, res) => {
    try {
        const updated = await Vendor.findByIdAndUpdate(req.body.vendorId, { kycStatus: 'Pending' }, { new: true });
        res.json({ message: "KYC Pending Review", updated });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};