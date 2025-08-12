const express = require('express');
const router = express.Router();
const controller = require('../controllers/authenticationController');

router.get('/', controller.getAllCustomers); // get all customers
router.post('/login', controller.getCustomerLogin); 
// router.patch('/signup', controller.getCustomerSignup); 

module.exports = router;
