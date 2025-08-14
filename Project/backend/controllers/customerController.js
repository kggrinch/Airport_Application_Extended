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
  flight = req.body.flight_id;
  user = req.body.user_id;
  seat = req.body.seat_id;
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
  ticket = req.body.ticket_id;
  connection.query(`INSERT INTO booking (ticket_id) VALUES(?)`,
    [ticket],
    (err, booking) =>
    {
      if(err)
      {
        console.error(err);
        return res.status(500).json({Error: `Failed: Booking was not created`})
      }
      else
      {
        res.status(201).json({Success: "Booking created", booking_id: booking.insertId});
      }
    });
}