const express = require('express');
const router = express.Router();
const controller = require('../controllers/authenticationController');

router.get('/', controller.getAllCustomers); // get all customers
router.post('/login', controller.getCustomerLogin); // get userid of matching username and password

module.exports = router;
