const Flight = require('../models/flights');

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
exports.getAllFlights = async (req, res) => 
{
  try 
  {
    const flights = await Flight.findAll({where: {scheduled: false}});
    res
    .status(200)
    .set('Content-Type', 'application/json')
    .set('Cache-Control', 'no-cache')
    .json(flights);
  } 
  catch (err) 
  {
    res.status(500).json({ Error: 'Error fetching flights' });
  }
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
exports.getAllScheduledFlights = async (req, res) =>
{
  try
  {
    const flights = await Flight.findAll({ where: { scheduled: true } });
    res
    .status(200)
    .set('Content-Type', 'application/json')
    .set('Cache-Control', 'no-cache')
    .json(flights);
  }
  catch (err)
  {
    res.status(500).json({ Error: 'Error fetching flights' });
  }
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
exports.getScheduledFlightById = async (req, res) =>
{
  try
  {
    const flights = await Flight.findOne({
      where: 
      {
        id: req.params.id,
        scheduled: true, 
      },
    });
    
    if(flights) 
    {
      res
      .status(200)
      .set('Content-Type', 'application/json')
      .set('Cache-Control', 'no-cache')
      .set('FlightId', req.params.id)
      .json(flights);
    }
    else res.status(404).json({ Error: 'flight not found' });
  }
  catch (err)
  {
    res.status(500).json({ Error: 'error fetching flights' });
  }
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
exports.updateScheduledFlight = async (req, res) =>
{
  try
  {
    const flight = await Flight.findByPk(req.params.id);
    if (flight) 
    {
      flight.scheduled = req.body.scheduled;
      await flight.save();
      res
      .status(200)
      .set('Content-Type', 'application/json')
      .set('Cache-Control', 'no-cache')
      .set('FlightId', req.params.id)
      .set('ScheduledSet', req.body.scheduled)
      .json(flight);
    } 
    else 
    {
      res.status(404).json({Error: 'Flight not found' });
    }
  }
  catch (err)
  {
    res.status(500).json({Error: 'Error updating flight' });
  }
}
