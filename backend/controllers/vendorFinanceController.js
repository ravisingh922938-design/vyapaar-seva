const Vendor = require('../models/Vendor');
const Transaction = require('../models/Transaction');
const Invoice = require('../models/Invoice');
const Expense = require('../models/Expense');
const LoanApplication = require('../models/LoanApplication');
const Compliance = require('../models/Compliance');

exports.getWalletBalance = async (req, res) => {
    try { const v = await Vendor.findById(req.params.id); res.json({ walletBalance: v.walletBalance }); }
    catch (e) { res.status(500).json(e); }
};

exports.addMoney = async (req, res) => {
    try {
        const v = await Vendor.findById(req.params.id);
        v.walletBalance += Number(req.body.amount); await v.save();
        await Transaction.create({ vendorId: v._id, amount: req.body.amount, type: 'credit', description: "Recharge" });
        res.json({ message: "Success", balance: v.walletBalance });
    } catch (e) { res.status(500).json(e); }
};

exports.getTransactions = async (req, res) => {
    try { const t = await Transaction.find({ vendorId: req.params.vendorId }).sort({ createdAt: -1 }); res.json(t); }
    catch (e) { res.status(500).json(e); }
};

exports.getProfitLoss = async (req, res) => {
    try { res.json({ income: 0, expense: 0, profit: 0 }); } catch (e) { res.status(500).json(e); }
};

exports.addExpense = async (req, res) => {
    try { const ex = await Expense.create(req.body); res.json(ex); } catch (e) { res.status(500).json(e); }
};

exports.createInvoice = async (req, res) => {
    try { const i = await Invoice.create(req.body); res.json(i); } catch (e) { res.status(500).json(e); }
};

exports.getInvoices = async (req, res) => {
    try { const i = await Invoice.find({ vendorId: req.params.vendorId }); res.json(i); } catch (e) { res.status(500).json(e); }
};

exports.applyForLoan = async (req, res) => {
    try { const l = await LoanApplication.create(req.body); res.json(l); } catch (e) { res.status(500).json(e); }
};

exports.applyForTaxService = async (req, res) => {
    try { const c = await Compliance.create(req.body); res.json(c); } catch (e) { res.status(500).json(e); }
};

exports.initiateRecharge = async (req, res) => { res.json({ status: "Initiated" }); };