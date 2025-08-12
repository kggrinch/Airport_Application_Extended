const express = require('express');
const router = express.Router();
const controller = require('../controllers/customerController');

router.get('/airports', controller.getAllAirports); // get all airports
router.get('/airports/:id/flights', controller.getFlightsByAirport); // get flights by airport code

module.exports = router;
