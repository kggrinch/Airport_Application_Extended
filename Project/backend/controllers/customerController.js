const connection = require('../config');

// Retrieve all airports
  exports.getAllAirports = (req, res) => {
  connection.query(`
    SELECT *
    FROM airport 
    ORDER BY airport_name
  `, (err, airports) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ Error: 'Error fetching airports' });
    }
    res.status(200).json(airports);
  });
};

// Retrieve all flights at a given airport 
// Query 8 of part C phase 2 (1/4 queries from part c phase 2)
// Purpose: Show all flights at an airport, including its name and code.
// Expected: List of flight numbers, airline names, and departure airport details.
exports.getFlightsByAirport = (req, res) => {
  const airport_id = req.params.id;
  connection.query(
    `SELECT 
    flight.flight_number,
    flight.airline,
    departure_airport.code AS departure_airport_code,
    arrival_airport.code AS arrival_airport_code,
    flight.boarding_time,
    flight.departure_time,
    flight.arrival_time,
    flight.gate_number
    FROM flight
    JOIN airport departure_airport 
        ON flight.departure_airport_id = departure_airport.airport_id
    JOIN airport arrival_airport 
        ON flight.arrival_airport_id = arrival_airport.airport_id
    WHERE departure_airport.airport_id = ?;`,
    [airport_id], (err, flights) => 
    {
    if (err) 
    {
      console.error(err);
      return res.status(500).json({ Error: 'Error fetching flights' });
    }
    res.status(200).json(flights);
  });
};

// Retrieve all flight at all airports
exports.getAllFlights = (req, res) => {
  connection.query(
    `SELECT 
      flight.flight_number,
      flight.airline,
      departure_airport.code AS departure_airport_code,
      arrival_airport.code AS arrival_airport_code,
      flight.boarding_time,
      flight.departure_time,
      flight.arrival_time,
      flight.gate_number
    FROM flight
    JOIN airport departure_airport 
      ON flight.departure_airport_id = departure_airport.airport_id
    JOIN airport arrival_airport 
      ON flight.arrival_airport_id = arrival_airport.airport_id
    ORDER BY flight.departure_time ASC`,
    (err, flights) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ Error: 'Error fetching all flights' });
      }
      res.status(200).json(flights);
    }
  );
};

// Retrieve available seats at a given flight
// Query 6 of part C phase 2 (2/4 queries from part c phase 2)
// Purpose: List available seat numbers for given flight 
// Expected: List of seat numbers that are still available for the given flight.
exports.getAvailableSeats = (req, res) => 
{
  const flight_number = req.params.id;
  connection.query(
    `SELECT seat.seat_number
    FROM seat
    WHERE seat.seat_number NOT IN (
        SELECT ticket.seat_number 
        FROM ticket
        WHERE ticket.flight_number = ?
    )
    ORDER BY seat.seat_number;
    `,
    [flight_number],
    (err, seats) =>
    {
      if (err) 
      {
        console.error(err);
        return res.status(500).json({ Error: 'Error fetching seats' });
      }
      res.status(200).json(seats);
    });
}

// Create new ticket
exports.createTicket = (req, res) =>
{
  const flight = req.body.flight_id;
  const user = req.body.user_id;
  const seat = req.body.seat_number;
  connection.query(`
    INSERT INTO ticket(flight_number, user_id, seat_number) VALUES(?, ?, ?)`,
    [flight, user, seat],
    (err, ticket) =>
    {
      if(err)
      {
        console.error(err);
        return res.status(400).json({Error: `Failed: Ticket was not created.`})
      }
      res.status(201).json({ticket_id: ticket.insertId});
    });
}

// create new booking of new ticket (works directly with createTicket endpoint)
exports.createBooking = (req, res) =>
{
  const ticket = req.body.ticket_id;
  connection.query(`INSERT INTO booking (ticket_id) VALUES(?)`,
    [ticket],
    (err, booking) =>
    {
      if(err)
      {
        console.error(err);
        return res.status(500).json({Error: `Failed: Booking was not created`})
      }
      res.status(201).json({Success: "Booking created", booking_id: booking.insertId});
    });
}

// delete ticket
exports.deleteTicket = (req, res) =>
{
  // This query deletes the ticket given ticket_id. However, it is also possible to delete the ticket given flight number and seat number.
  const ticket = req.body.ticket_id;
  connection.query(`DELETE FROM ticket WHERE ticket_id = ?`,
    [ticket],
    (err, result) =>
    {
      if(err)
      {
        console.log(err);
        return res.status(500).json({Error: `Failed: Booking and Ticket not deleted`});
      }
      res.status(200).json({Success: `Success: ticket ${ticket} successfully deleted`});
    });
}

// Retrieve all booking information given user id
// Query 7 of part C phase 2 (3/4 queries from part c phase 2)
// Purpose: Show all bookings made by user
// Expected: Booking ID, total price, and booking date.
exports.getBookingsByUser = (req, res) => {
  const user_id = req.params.id; 
  connection.query(`SELECT 
    ticket.ticket_id, 
    ticket.flight_number, 
    departure_airport.code AS departure_airport, 
    arrival_airport.code AS arrival_airport, 
    seat.seat_number, 
    class.class_type
  FROM ticket
    JOIN seat ON ticket.seat_number = seat.seat_number
    JOIN class ON seat.class_type = class.class_type
    JOIN flight ON ticket.flight_number = flight.flight_number
    JOIN airport AS departure_airport ON flight.departure_airport_id = departure_airport.airport_id
    JOIN airport AS arrival_airport ON flight.arrival_airport_id = arrival_airport.airport_id
  WHERE user_id = ?;`,
   [user_id],
    (err, bookings) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ Error: 'Error fetching bookings' });
      }
      res.status(200).json(bookings);
    }
  );
};

// Gets all flight details of a given flight
// Query 10 of part C phase 2 (4/4 queries from part c phase 2)
// Purpose: Get all flight details of a given flight including the airport and airport location of the flight
// Expected: List of flights with their flight information, boarding details, and airport with location details.
exports.getFlightDetails = (req, res) => 
{
  const flight_number = req.params.id;

  connection.query(`SELECT
    flight.flight_number, 
    flight.airline,
    airport.code AS departure_airport, 
    arrival_airport.code AS arrival_airport, 
    flight.boarding_time,
    flight.departure_time,
    flight.arrival_time,
    flight.gate_number,
    airport.airport_name, 
    airport_location.city, 
    airport_location.state, 
    airport_location.location_zip
  FROM flight
    JOIN airport ON flight.departure_airport_id = airport.airport_id
    JOIN airport_location on airport.location_zip = airport_location.location_zip
    JOIN airport AS arrival_airport ON flight.arrival_airport_id = arrival_airport.airport_id
  WHERE flight_number = ?`,
    [flight_number],
    (err, flightDetails) =>
    {
      if (err) 
      {
        console.error(err);
        return res.status(500).json({ Error: 'Error fetching flight details' });
      }
      res.status(200).json(flightDetails);
    }
  );
};

// Retrieve all boarding details of a given flight
exports.getBoardingDetails = (req, res) =>
{
  const flight = req.params.id;
  connection.query(`SELECT gate_number, boarding_time, departure_time, arrival_time
    FROM flight
    WHERE flight_number = ?`,
  [flight],
  (err, boarding) =>
  {
    if(err)
    {
      console.log(err);
      return res.status(500).json({Error: `Error fetching boarding details`});
    }
    res.status(200).json(boarding);
  });
};

// Retrieve pricing details of a given ticket
exports.getPricingDetails = (req, res) =>
{
  const ticket = req.params.id;
  connection.query(`SELECT booking_date, flight_price, seat_price, tax, total_price
  FROM booking
  WHERE ticket_id = ?`,
  [ticket],
  (err, pricing) =>
  {
    if(err)
    {
      console.log(err);
      return res.status(500).json({Error: `Error fetching pricing details`});
    }
    res.status(200).json(pricing);
  });
};