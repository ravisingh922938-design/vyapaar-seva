const Vendor = require('../models/Vendor');
const Salesman = require('../models/Salesman');
const Transaction = require('../models/Transaction');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // ✅ मंतु भाई, ये लाइन ज़रूरी है टोकन बनाने के लिए

// ============================================================
// 1. SALESMAN JOINING (Registration)
// ============================================================
exports.registerSalesman = async (req, res) => {
    try {
        const { name, phone, email, password, area } = req.body;
        const existing = await Salesman.findOne({ $or: [{ email: email.toLowerCase() }, { phone }] });
        if (existing) return res.status(400).json({ message: "Aap pehle se registered hain!" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const empId = "VS-" + phone.slice(-4);
        const referralCode = "REF-" + Math.random().toString(36).substring(2, 7).toUpperCase();

        const newSalesman = new Salesman({
            name, phone, email: email.toLowerCase(), area,
            password: hashedPassword,
            empId: empId,
            referralCode: referralCode,
            walletBalance: 0
        });

        await newSalesman.save();
        res.status(201).json({ status: "success", message: "Joining Successful!", empId });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// ============================================================
// ✅ 2. SALESMAN LOGIN (पूरी तरह सही और नया कोड)
// ============================================================
exports.loginSalesman = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Salesman Login Attempt:", email);

        // १. ईमेल से सेल्समैन को ढूँढना
        const salesman = await Salesman.findOne({ email: email.toLowerCase() });
        if (!salesman) {
            return res.status(404).json({ status: "error", message: "Aap registered nahi hain!" });
        }

        // २. पासवर्ड चेक करना
        const isMatch = await bcrypt.compare(password, salesman.password);
        if (!isMatch) {
            return res.status(400).json({ status: "error", message: "Password galat hai!" });
        }

        // ३. चाबी (Token) बनाना - ७ दिन के लिए
        const token = jwt.sign(
            { id: salesman._id, role: 'salesman' },
            process.env.JWT_SECRET || 'vister_tech_2026_key',
            { expiresIn: '7d' }
        );

        res.status(200).json({
            status: "success",
            token,
            user: {
                id: salesman._id,
                name: salesman.name,
                email: salesman.email,
                empId: salesman.empId
            }
        });

    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ status: "error", message: "Login Fail: Server Error" });
    }
};

// ============================================================
// 3. LEAD POOL (IndiaMart Style)
// ============================================================
exports.getAvailablePool = async (req, res) => {
    try {
        const { salesmanPincode } = req.query;
        const pool = await Vendor.find({
            pincode: salesmanPincode,
            isClaimed: false
        }).select('shopName area pincode createdAt name');
        res.json(pool);
    } catch (err) { res.status(500).send(err); }
};

// --- Claim Lead Logic ---
exports.claimLead = async (req, res) => {
    try {
        const { vendorId, salesmanId } = req.body;
        const vendor = await Vendor.findById(vendorId);
        if (vendor.isClaimed) return res.status(400).json({ message: "Booked ho gayi!" });

        vendor.assignedSalesman = salesmanId;
        vendor.isClaimed = true;
        await vendor.save();
        res.json({ status: "success", message: "Claimed!", phone: vendor.phone });
    } catch (err) { res.status(500).send(err); }
};

// ============================================================
// 4. RELEASE LEAD SYSTEM
// ============================================================
exports.releaseLead = async (req, res) => {
    try {
        const { vendorId, salesmanId } = req.body;
        const vendor = await Vendor.findById(vendorId);
        if (!vendor.assignedSalesman || vendor.assignedSalesman.toString() !== salesmanId) {
            return res.status(403).json({ message: "Aap nahi hata sakte!" });
        }
        vendor.assignedSalesman = null;
        vendor.isClaimed = false;
        await vendor.save();
        res.json({ status: "success", message: "Released to Pool!" });
    } catch (err) { res.status(500).json({ message: "Release fail" }); }
};

// ============================================================
// 5. WORKLIST & NOTEPAD
// ============================================================
exports.getMyTargets = async (req, res) => {
    try {
        const { salesmanId } = req.params;
        const myLeads = await Vendor.find({ assignedSalesman: salesmanId })
            .select('name shopName phone area walletBalance hasRecharged salesNotes');
        res.json(myLeads);
    } catch (err) { res.status(500).send(err); }
};

// --- Digital Note Logic ---
exports.addSalesNote = async (req, res) => {
    try {
        const { vendorId, note, salesmanId, salesmanName } = req.body;
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) return res.status(404).json({ message: "Seller nahi mila" });
        vendor.salesNotes.push({ note, salesmanId, salesmanName });
        await vendor.save();
        res.json({ status: "success", message: "Note Saved!" });
    } catch (err) { res.status(500).send(err); }
};

// ============================================================
// 6. KYC & FINANCE
// ============================================================
exports.submitSalesmanKYC = async (req, res) => {
    try {
        const { salesmanId, aadhaarNumber, panNumber, address } = req.body;
        const aadhaarPhoto = req.files && req.files['aadhaarPhoto'] ? req.files['aadhaarPhoto'][0].filename : "";
        const panPhoto = req.files && req.files['panPhoto'] ? req.files['panPhoto'][0].filename : "";

        await Salesman.findByIdAndUpdate(salesmanId, {
            kycDetails: { aadhaarNumber, panNumber, address, aadhaarPhoto, panPhoto, status: 'Pending' }
        });
        res.json({ status: "success", message: "KYC Documents received!" });
    } catch (err) { res.status(500).send(err); }
};

// --- Monday Payout (Wallet Zero) ---
exports.resetSalesmanWallet = async (req, res) => {
    try {
        const { salesmanId } = req.body;
        const salesman = await Salesman.findById(salesmanId);
        const amountPaid = salesman.walletBalance;
        if (amountPaid <= 0) return res.status(400).json({ message: "Wallet empty" });

        await Transaction.create({
            salesmanId: salesmanId, amount: amountPaid, type: 'payout', status: 'Success'
        });
        salesman.walletBalance = 0;
        await salesman.save();
        res.json({ status: "success", message: "Payout Success, Wallet Zero!" });
    } catch (err) { res.status(500).json({ message: "Payout fail" }); }
};

// ============================================================
// 7. SALESMAN OVERVIEW (Status Logic)
// ============================================================
exports.getSalesLeads = async (req, res) => {
    try {
        const { salesmanId } = req.query; 
        let filter = {};
        if (salesmanId) filter.assignedSalesman = salesmanId;

        const vendors = await Vendor.find(filter)
            .select('name shopName phone area walletBalance hasRecharged createdAt');

        const formattedData = vendors.map(v => {
            let status = v.walletBalance > 0 ? "ACTIVE (Paisa hai)" : (v.hasRecharged ? "EXPIRED (Khatam)" : "NEW (Naya)");
            let color = v.walletBalance > 0 ? "green" : (v.hasRecharged ? "red" : "blue");
            return {
                id: v._id, name: v.name, shop: v.shopName, phone: v.phone,
                area: v.area, balance: v.walletBalance, status, statusColor: color, joined: v.createdAt
            };
        });
        res.json(formattedData);
    } catch (err) { res.status(500).json({ message: "Fetch fail" }); }
};