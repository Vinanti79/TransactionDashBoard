const express = require('express');
const router = express.Router();
const { fetchAndSeedData } = require('../controllers/dataController');

// Initialize database with seed data
router.get('/init-database', fetchAndSeedData);

module.exports = router;
