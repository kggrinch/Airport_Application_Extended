const express = require('express');
const router = express.Router();
const controller = require('../controllers/customerController');

router.get('/', controller.getAllFlights); // get all flights
router.patch('/:id', controller.updateScheduledFlight); // update schedule of flight by id
router.get('/scheduled', controller.getAllScheduledFlights); // get all scheduled flights
router.get('/scheduled/:id', controller.getScheduledFlightById); // get scheduled flight by id

module.exports = router;
