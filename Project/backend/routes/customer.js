const express = require('express');
const router = express.Router();
const controller = require('../controllers/customerController');

router.get('/airports', controller.getAllAirports); // get all airports
router.get('/airports/:id/flights', controller.getFlightsByAirport); // get flights by airport code



// router.get('/', controller.getAllFlights); // get all flights
// router.patch('/:id', controller.updateScheduledFlight); // update schedule of flight by id
// router.get('/scheduled', controller.getAllScheduledFlights); // get all scheduled flights
// router.get('/scheduled/:id', controller.getScheduledFlightById); // get scheduled flight by id


module.exports = router;
