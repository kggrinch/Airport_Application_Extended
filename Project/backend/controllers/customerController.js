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
    }
  )
}

exports.getBookingsByUser = (req, res) => {
  const user_id = req.params.id; 
  
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

exports.getFlightDetails = (req, res) => 
{
  const flight_number = req.params.id;

  connection.query(
    `SELECT
      dep_airport.airport_name AS departure_airport_name,
      dep_location.city AS departure_city,
      dep_location.state AS departure_state,
      dep_location.location_zip AS departure_zip,
      dep_airport.code AS from_code,

      arr_airport.airport_name AS arrival_airport_name,
      arr_location.city AS arrival_city,
      arr_location.state AS arrival_state,
      arr_location.location_zip AS arrival_zip,
      arr_airport.code AS to_code,

      flight.boarding_time,
      flight.departure_time,
      flight.arrival_time,
      flight.gate_number,

      booking.seat_price,
      booking.flight_price,
      booking.total_price

    FROM flight
    JOIN airport dep_airport 
      ON flight.departure_airport_id = dep_airport.airport_id
    JOIN airport_location dep_location 
      ON dep_airport.location_zip = dep_location.location_zip
    JOIN airport arr_airport 
      ON flight.arrival_airport_id = arr_airport.airport_id
    JOIN airport_location arr_location 
      ON arr_airport.location_zip = arr_location.location_zip
    LEFT JOIN ticket 
      ON flight.flight_number = ticket.flight_number
    LEFT JOIN booking 
      ON ticket.ticket_id = booking.ticket_id
    WHERE flight.flight_number = ?;`,
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