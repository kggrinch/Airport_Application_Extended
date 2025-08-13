const express = require('express');
const router = express.Router();
const controller = require('../controllers/customerController');

router.get('/airports', controller.getAllAirports); // get all airports
router.get('/airports/:id/flights', controller.getFlightsByAirport); // get flights by airport code
router.get('/flight/:id/seats', controller.getAvailableSeats); // get available seats of a given flight

module.exports = router;
