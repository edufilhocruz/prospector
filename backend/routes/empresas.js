const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

// Conectar rota ao controller
router.get('/', companyController.getCompanies);

module.exports = router;
