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
  connection.query(`
    SELECT 
    flight.flight_number,
    flight.airline,
    airport.airport_name,
    airport.code
    FROM flight
    JOIN airport ON flight.departure_airport_id = airport.airport_id
    WHERE airport.airport_id = ?;
  `, [airport_id], (err, flights) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ Error: 'Error fetching flights' });
    }
    res.status(200).json(flights);
  });
};
