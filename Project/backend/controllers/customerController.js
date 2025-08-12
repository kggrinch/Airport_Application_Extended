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
