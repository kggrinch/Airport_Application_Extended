const express = require('express');
const router = express.Router();
const controller = require('../controllers/customerController');

router.get('/airports', controller.getAllAirports); // get all airports
router.get('/flights', controller.getAllFlights); // get all flights
router.get('/airports/:id/flights', controller.getFlightsByAirport); // get flights by airport code
router.get('/flight/:id/seats', controller.getAvailableSeats); // get available seats of a given flight
router.get('/:id/bookings', controller.getBookingsByUser); // get bookings for a user
router.get('/flights/:id', controller.getFlightDetails); // get flight details by flight ID
router.get('/flight/:id/boarding', controller.getBoardingDetails) // get boarding info

router.post('/flight/ticket', controller.createTicket);            // router.post('/:customer_id/flights/:flight_id/seats/:seat_id', controller.createTicket);
router.post('/flight/ticket/booking', controller.createBooking);   // router.post('/:customer_id/flights/:flight_id/seats/:seat_id/booking', controller.createBooking);

router.delete('/flight/ticket', controller.deleteTicket); // delete ticket deletes the booking which cascades to the ticket.

module.exports = router;
