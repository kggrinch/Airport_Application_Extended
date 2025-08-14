const connection = require('../config');

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

exports.createTicket = (req, res) =>
{
  const flight = req.body.flight_id;
  const user = req.body.user_id;
  const seat = req.body.seat_number;
  console.log(`flight: ${flight}, user: ${user}, seat: ${seat}`);
  
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

exports.getBookingsByUser = (req, res) => {
  const user_id = req.params.id; // Now getting from params instead of query
  
  connection.query(
    `SELECT 
      ticket.ticket_id,
      ticket.flight_number,
      seat.seat_number,
      class.class_type,
      booking.booking_date,
      booking.flight_price,
      booking.seat_price,
      booking.tax,
      booking.total_price,
      customer.first_name,
      customer.last_name,
      departure_airport.code AS departure_airport_code,
      arrival_airport.code AS arrival_airport_code,
      flight.gate_number
    FROM booking
    JOIN ticket ON booking.ticket_id = ticket.ticket_id
    JOIN customer ON ticket.user_id = customer.user_id
    JOIN seat ON ticket.seat_number = seat.seat_number
    JOIN class ON seat.class_type = class.class_type
    JOIN flight ON ticket.flight_number = flight.flight_number
    JOIN airport departure_airport 
      ON flight.departure_airport_id = departure_airport.airport_id
    JOIN airport arrival_airport 
      ON flight.arrival_airport_id = arrival_airport.airport_id
    WHERE customer.user_id = ?
    ORDER BY booking.booking_date DESC`,
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
