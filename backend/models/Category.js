const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    icon: {
        type: String
    },
    leadPrice: {
        type: Number,
        default: 20
    }
});

module.exports = mongoose.model('Category', CategorySchema);