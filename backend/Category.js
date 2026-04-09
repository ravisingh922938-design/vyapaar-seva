const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // e.g. Plumber, Doctor
    icon: { type: String }, // Icon URL
    leadPrice: { type: Number, default: 20 } // Har lead ka price
});

module.exports = mongoose.model('Category', CategorySchema);