const Lead = require('../models/Lead');

// 1. OTP Bhejna (Abhi ke liye bypassed)
exports.sendOTP = async (req, res) => {
    res.status(200).json({ status: "success", message: "OTP bypassed" });
};

// 2. Lead create karne ka sahi function
exports.verifyAndCreateLead = async (req, res) => {
    console.log("📥 DATA RECEIVED FROM FRONTEND:", req.body);

    try {
        // Frontend se aane wali saari fields
        const { customerName, customerPhone, area, category, description, fullAddress } = req.body;

        // Validation: Required fields check karein
        if (!customerName || !customerPhone || !category) {
            return res.status(400).json({
                status: "error",
                message: "Naam, Phone aur Category ID zaroori hai!"
            });
        }

        // Description aur Address ko merge karke 'message' field mein save karein
        const combinedMessage = `Work: ${description || "N/A"} | Address: ${fullAddress || "N/A"}`;

        const newLead = await Lead.create({
            customerName: customerName,
            customerPhone: customerPhone,
            area: area || "Boring Road",
            category: category, // Ye ab 'selectedCat._id' honi chahiye
            message: combinedMessage,
            status: 'pending'
        });

        console.log("✅ Database mein Lead save ho gayi!");

        return res.status(201).json({
            status: "success",
            message: "Enquiry saved successfully!",
            lead: newLead
        });

    } catch (err) {
        // Agar category ID galat hai toh ye galti pakdega
        console.error("❌ DATABASE ERROR DETAILS:", err.message);

        return res.status(500).json({
            status: "error",
            message: "Database Error: " + err.message
        });
    }
};

// 3. Saare leads dikhane ke liye (Optional)
exports.getAllLeads = async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.status(200).json(leads);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};