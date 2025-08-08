const connection = require('../config');


/**
 * @api {get} /customer Get All Unscheduled Flights
 * @apiName GetAllUnscheduledFlights
 * @apiGroup Customer
 * 
 * @apiSuccess {Object[]} UnscheduledFlight List of unscheduled flight objects.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "id": 1,
 *         "flight_number": "AA101",
 *         "airline": "American_Airlines",
 *         "origin": "JFK",
 *         "destination": "SEA",
 *         "departure_time": "2025-07-17T08:30:00.000Z",
 *         "arrival_time": "2025-07-17T11:45:00.000Z",
 *         "gate": "A12",
 *         "scheduled": false
 *     },...
 * 
 * @apiError (Error 500) InternalServerError Unable to fetch flights from the database.
 * 
 * @apiErrorExample {json} 500-Error-Response:
 *      HTTP/1.1 500 Internal Server Error
 *      {
 *        "Error": "Error fetching flights"
 *      }
 */
exports.getAllFlights = (req, res) => {
  connection.query('SELECT * FROM flights WHERE scheduled = FALSE', (err, flights) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ Error: 'Error fetching flights' });
    }
    res
      .status(200)
      .set('Content-Type', 'application/json')
      .set('Cache-Control', 'no-cache')
      .json(flights);
  });
};

/**
 * @api {get} /customer/scheduled Get All Scheduled Flights
 * @apiName GetAllScheduledFlights
 * @apiGroup Customer
 * 
 * @apiSuccess {Object[]} ScheduledFlight List of Scheduled flight objects.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "id": 1,
 *         "flight_number": "AA101",
 *         "airline": "American_Airlines",
 *         "origin": "JFK",
 *         "destination": "SEA",
 *         "departure_time": "2025-07-17T08:30:00.000Z",
 *         "arrival_time": "2025-07-17T11:45:00.000Z",
 *         "gate": "A12",
 *         "scheduled": true
 *     },...
 * 
 * @apiError (Error 500) InternalServerError Unable to fetch flights from the database.
 * 
 * @apiErrorExample {json} 500-Error-Response:
 *      HTTP/1.1 500 Internal Server Error
 *      {
 *        "Error": "Error fetching flights"
 *      }
 */
exports.getAllScheduledFlights = (req, res) => {
  connection.query('SELECT * FROM flights WHERE scheduled = TRUE', (err, flights) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ Error: 'Error fetching flights' });
    }
    res
      .status(200)
      .set('Content-Type', 'application/json')
      .set('Cache-Control', 'no-cache')
      .json(flights);
  });
};

/**
 * @api {get} /customer/scheduled/:id Get Scheduled Flight
 * @apiName GetScheduledFlight
 * @apiGroup Customer
 * 
 * @apiParam {Integer} id Flights unique id.
 * 
 * @apiSuccess {Integer} id Id of the flight.
 * @apiSuccess {String} flight_number Flight number of the flight.
 * @apiSuccess {String} airline Airline of the flight.
 * @apiSuccess {String} origin Origin of the flight.
 * @apiSuccess {String} destination Destination of the flight.
 * @apiSuccess {String} departure_time Departure time of the flight.
 * @apiSuccess {String} arrival_time Arrival time of the flight.
 * @apiSuccess {String} gate Gate of the flight.
 * @apiSuccess {Boolean} scheduled Whether flight is scheduled.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "id": 1,
 *         "flight_number": "AA101",
 *         "airline": "American_Airlines",
 *         "origin": "JFK",
 *         "destination": "SEA",
 *         "departure_time": "2025-07-17T08:30:00.000Z",
 *         "arrival_time": "2025-07-17T11:45:00.000Z",
 *         "gate": "A12",
 *         "scheduled": true
 *     }
 * 
 * @apiError (Error 404) FlightNotFound The Flight was not found.
 * 
 * @apiErrorExample {json} 404-Error-Response:
 *      HTTP/1.1 404 Bad Flight Not Found Error
 *      {
 *        "Error": "Failed: flight not found."
 *      }
 * 
 * @apiError BadRequest Unable to fetch flight.
 * 
 * @apiErrorExample {json} 4xx-Error-Response:
 *      HTTP/1.1 400 Bad Request Error
 *      {
 *        "Error": "Failed: error fetching flight"
 *      }
 */
exports.getScheduledFlightById = (req, res) => {
  connection.query(
    'SELECT * FROM flights WHERE id = ? AND scheduled = TRUE',
    [req.params.id],
    (err, flights) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ Error: 'error fetching flights' });
      }
      if (flights.length > 0) {
        res
          .status(200)
          .set('Content-Type', 'application/json')
          .set('Cache-Control', 'no-cache')
          .set('FlightId', req.params.id)
          .json(flights[0]);
      } else {
        res.status(404).json({ Error: 'flight not found' });
      }
    }
  );
};

/**
 * @api {patch} /customer/:id Update Flight Schedule
 * @apiName UpdateFlightSchedule
 * @apiGroup Customer
 * 
 * @apiParam {Integer} id Flights unique id.
 * 
 * @apiBody {Boolean} scheduled Whether flight is scheduled/unscheduled.
 * 
 * @apiSuccess {Integer} id Id of the flight.
 * @apiSuccess {String} flight_number Flight number of the flight.
 * @apiSuccess {String} airline Airline of the flight.
 * @apiSuccess {String} origin Origin of the flight.
 * @apiSuccess {String} destination Destination of the flight.
 * @apiSuccess {String} departure_time Departure time of the flight.
 * @apiSuccess {String} arrival_time Arrival time of the flight.
 * @apiSuccess {String} gate Gate of the flight.
 * @apiSuccess {Boolean} scheduled Whether flight is scheduled.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "id": 1,
 *         "flight_number": "AA101",
 *         "airline": "American_Airlines",
 *         "origin": "JFK",
 *         "destination": "SEA",
 *         "departure_time": "2025-07-17T08:30:00.000Z",
 *         "arrival_time": "2025-07-17T11:45:00.000Z",
 *         "gate": "A12",
 *         "scheduled": true
 *     }
 * 
 * @apiError (Error 404) FlightNotFound The Flight was not found.
 * 
 * @apiErrorExample {json} 404-Error-Response:
 *      HTTP/1.1 404 Bad Flight Not Found Error
 *      {
 *        "Error": "Failed: flight not found."
 *      }
 * 
 * @apiError BadRequest Unable to fetch flight.
 * 
 * @apiErrorExample {json} 4xx-Error-Response:
 *      HTTP/1.1 400 Bad Request Error
 *      {
 *        "Error": "Failed: error fetching flight"
 *      }
 */
exports.updateScheduledFlight = (req, res) => {
  // First check if flight exists
  connection.query(
    'SELECT * FROM flights WHERE id = ?',
    [req.params.id],
    (err, flights) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ Error: 'Error fetching flight' });
      }
      if (flights.length === 0) {
        return res.status(404).json({ Error: 'Flight not found' });
      }

      // Update scheduled status
      connection.query(
        'UPDATE flights SET scheduled = ? WHERE id = ?',
        [req.body.scheduled, req.params.id],
        (err2) => {
          if (err2) {
            console.error(err2);
            return res.status(500).json({ Error: 'Error updating flight' });
          }

          // Fetch updated flight
          connection.query(
            'SELECT * FROM flights WHERE id = ?',
            [req.params.id],
            (err3, updatedFlights) => {
              if (err3) {
                console.error(err3);
                return res.status(500).json({ Error: 'Error fetching updated flight' });
              }
              res
                .status(200)
                .set('Content-Type', 'application/json')
                .set('Cache-Control', 'no-cache')
                .set('FlightId', req.params.id)
                .set('ScheduledSet', req.body.scheduled)
                .json(updatedFlights[0]);
            }
          );
        }
      );
    }
  );
};
