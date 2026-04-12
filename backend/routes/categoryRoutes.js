const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// URL: http://localhost:5000/api/categories/seed
router.get('/seed', categoryController.seedCategories);

// URL: http://localhost:5000/api/categories
router.get('/', categoryController.getCategories);

module.exports = router;