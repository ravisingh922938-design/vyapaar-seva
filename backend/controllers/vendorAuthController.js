const Vendor = require('../models/Vendor');
const Transaction = require('../models/Transaction');

// 1. Get All Vendors (Admin / General List)
exports.getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate('category');
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Get Single Vendor Details
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

// 3. Register New Vendor (With Photo & Referral)
exports.registerVendor = async (req, res) => {
    try {
        const { name, shopName, phone, category, area, description, referredBy } = req.body;

        // पक्का करें कि Multer से फाइल आ रही है
        const imagePath = req.file ? req.file.filename : "";

        const existingVendor = await Vendor.findOne({ phone });
        if (existingVendor) return res.status(400).json({ message: "Mobile Number already registered!" });

        const newVendor = new Vendor({
            name,
            shopName,
            phone,
            category,
            area,
            description,
            shopImage: imagePath, // फोटो यहाँ सेव हो रही है
            referralCode: "VISTER" + Math.floor(1000 + Math.random() * 9000),
            referredBy: referredBy || ""
        });

        await newVendor.save();
        res.status(201).json({ message: "Vendor Registered Successfully!", vendor: newVendor });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Search Vendors (Category/Area/Query Wise) - FIXED
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

        // यहाँ से सारा डेटा (shopImage के साथ) निकलेगा
        const vendors = await Vendor.find(filter).sort({ isVerified: -1 });

        // Debugging: टर्मिनल में चेक करें कि क्या डेटा में shopImage है?
        console.log(`Found ${vendors.length} vendors for search. Example Image:`, vendors[0]?.shopImage);

        res.json(vendors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 5. Update Vendor Profile
exports.updateProfile = async (req, res) => {
    try {
        const updated = await Vendor.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json({ message: "Updated!", updated });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 6. Submit KYC
exports.submitKYC = async (req, res) => {
    try {
        const updated = await Vendor.findByIdAndUpdate(req.body.vendorId, { kycStatus: 'Pending' }, { new: true });
        res.json({ message: "KYC Pending Review", updated });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};