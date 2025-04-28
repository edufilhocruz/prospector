const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const companyController = require('../controllers/companyController');

router.get('/', companyController.getCompanies);

router.post(
  '/',
  [
    check('cnpj').notEmpty().withMessage('CNPJ é obrigatório'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  companyController.addCompany
);

module.exports = router;