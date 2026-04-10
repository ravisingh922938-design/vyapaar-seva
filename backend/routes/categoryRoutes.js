const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// URL: http://api.vister.in/api/categories/seed
router.get('/seed', categoryController.seedCategories);

// URL: http://api.vister.in/api/categories
router.get('/', categoryController.getCategories);

module.exports = router;