const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    title: { type: String, required: true }, // e.g., "Dukan ka Rent"
    amount: { type: Number, required: true },
    category: { type: String, enum: ['Rent', 'Salary', 'Material', 'Marketing', 'Electricity', 'Other'], default: 'Other' },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', ExpenseSchema);