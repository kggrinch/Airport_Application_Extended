const express = require('express');
const router = express.Router();
const controller = require('../controllers/authenticationController');

router.get('/login', controller.getCustomerLogin); // get all flights
router.patch('/signup', controller.getCustomerSignup); // update schedule of flight by id

module.exports = router;
