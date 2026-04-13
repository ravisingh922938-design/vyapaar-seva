const Vendor = require('../models/Vendor');
const Transaction = require('../models/Transaction');
const Invoice = require('../models/Invoice');
const Expense = require('../models/Expense');
const LoanApplication = require('../models/LoanApplication');
const Compliance = require('../models/Compliance');
const Salesman = require('../models/Salesman'); // ✅ Ye import zaroori tha!

// ============================================================
// 1. RECHARGE & COMMISSION LOGIC (Asli Paisa Yahan Hai)
// ============================================================
exports.addMoney = async (req, res) => {
    try {
        const { amount, vendorId } = req.body;

        // 1. Dukaandaar (Vendor) ko dhundo
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) return res.status(404).json({ message: "Seller nahi mila!" });

        // 2. Seller ka balance update karo
        const rechargeAmount = Number(amount);
        vendor.walletBalance += rechargeAmount;

        // Salesman tracking ke liye fields update karein
        vendor.hasRecharged = true;
        vendor.lastRechargeDate = Date.now();

        await vendor.save();

        // 3. Transaction record banao (Seller ke liye)
        await Transaction.create({
            vendorId: vendor._id,
            amount: rechargeAmount,
            type: 'credit',
            description: "Wallet Recharge (Admin/UPI)",
            status: 'Success'
        });

        // 4. 🔥 SALESMAN COMMISSION LOGIC (₹100 Bonus)
        // Agar dukan kisi salesman ne jodi hai (assignedSalesman)
        if (vendor.assignedSalesman) {
            const salesman = await Salesman.findById(vendor.assignedSalesman);
            if (salesman) {
                salesman.walletBalance += 100; // Har recharge par salesman ko ₹100
                await salesman.save();

                // Salesman ke liye bhi ek transaction record bana sakte hain future me
                console.log(`💰 Commission: ₹100 credited to ${salesman.name} for ${vendor.shopName}`);
            }
        }

        res.json({
            status: "success",
            message: "Recharge Successful & Commission Processed!",
            newBalance: vendor.walletBalance
        });

    } catch (err) {
        console.error("Recharge Error:", err.message);
        res.status(500).json({ message: "Recharge fail ho gaya", error: err.message });
    }
};

// ============================================================
// 2. WALLET & TRANSACTION DETAILS
// ============================================================
exports.getWalletBalance = async (req, res) => {
    try {
        const v = await Vendor.findById(req.params.id).select('walletBalance');
        res.json({ walletBalance: v.walletBalance });
    } catch (e) { res.status(500).json(e); }
};

exports.getTransactions = async (req, res) => {
    try {
        const t = await Transaction.find({ vendorId: req.params.vendorId }).sort({ createdAt: -1 });
        res.json(t);
    } catch (e) { res.status(500).json(e); }
};

// ============================================================
// 3. FINANCE & P&L DASHBOARD (Hisaab-Kitaab)
// ============================================================
exports.getProfitLoss = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const invoices = await Invoice.find({ vendorId });
        const expenses = await Expense.find({ vendorId });

        const totalIncome = invoices.reduce((acc, curr) => acc + curr.totalAmount, 0);
        const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

        res.json({
            totalIncome,
            totalExpense,
            netProfit: totalIncome - totalExpense
        });
    } catch (e) { res.status(500).json(e); }
};

exports.addExpense = async (req, res) => {
    try {
        const ex = await Expense.create(req.body);
        res.json({ status: "success", expense: ex });
    } catch (e) { res.status(500).json(e); }
};

// ============================================================
// 4. INVOICES, LOANS & TAX
// ============================================================
exports.createInvoice = async (req, res) => {
    try {
        const i = await Invoice.create(req.body);
        res.json({ status: "success", invoice: i });
    } catch (e) { res.status(500).json(e); }
};

exports.getInvoices = async (req, res) => {
    try {
        const i = await Invoice.find({ vendorId: req.params.vendorId }).sort({ createdAt: -1 });
        res.json(i);
    } catch (e) { res.status(500).json(e); }
};

exports.applyForLoan = async (req, res) => {
    try {
        const l = await LoanApplication.create(req.body);
        res.json({ status: "success", message: "Loan Application Submitted", application: l });
    } catch (e) { res.status(500).json(e); }
};

exports.applyForTaxService = async (req, res) => {
    try {
        const c = await Compliance.create(req.body);
        res.json({ status: "success", message: "Request received", request: c });
    } catch (e) { res.status(500).json(e); }
};

exports.initiateRecharge = async (req, res) => {
    res.json({ status: "Success", message: "Order ID created for Gateway" });
};