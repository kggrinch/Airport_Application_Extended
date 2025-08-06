const sequelize = require('../config');
const Flight = require('../models/flights');


/**
 * @api {get} /admin Get All Flights
 * @apiName GetAllFlights
 * @apiGroup Admin
 * 
 * @apiSuccess {Object[]} Flight List of flight objects.
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
 *        "Error": "Failed: unable to fetch flights."
 *      }
 */
exports.getAllFlights = async (req, res) => 
{
 try 
  {
    const flights = await Flight.findAll();
    res
    .status(200)
    .set('Content-Type', 'application/json')
    .set('Cache-Control', 'no-cache')
    .json(flights);
  } 
  catch (err) 
  {
    res.status(500).json({Error: "Failed: unable to fetch flights."});
  }
};


/**
 * @api {get} /admin/:id Get Flight
 * @apiName GetFlight
 * @apiGroup Admin
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
 *         "scheduled": false
 *     }
 * 
 * @apiError (Error 404) FlightNotFound The id of the Flight was not found.
 * 
 * @apiErrorExample {json} 404-Error-Response:
 *      HTTP/1.1 404 FlightNotFound Error
 *      {
 *        "Error": "Failed: flight not found."
 *      }
 * 
 * @apiError (Error 500) InternalServerError Unable to fetch flight from the database.
 * 
 * @apiErrorExample {json} 500-Error-Response:
 *      HTTP/1.1 500 Internal Server Error
 *      {
 *        "Error": "Failed: unable to fetch flight."
 *      }
 */
exports.getFlightById = async (req, res) => 
{
  try
  {
    const flight = await Flight.findByPk(req.params.id);
    if (flight) 
    {
      res
      .status(200)
      .set('Content-Type', 'application/json')
      .set('Cache-Control', 'no-cache')
      .set('FlightId', req.params.id)
      .json(flight);
    }
    else res.status(404).json({Error: "Failed: flight not found."});
  } 
  catch (err)
  {
    res.status(500).json({Error: "Failed: unable to fetch flight."});
  }
};


/**
 * @api {post} /admin Create Flight
 * @apiName CreateFlight
 * @apiGroup Admin
 * 
 * @apiBody  {Integer} id Id of the new flight.
 * @apiBody  {String} flight_number Flight number of the new flight.
 * @apiBody  {String} airline Airline of the new flight.
 * @apiBody  {String} origin Origin of the new flight.
 * @apiBody  {String} destination Destination of the new flight.
 * @apiBody  {String} departure_time Departure time of the new flight.
 * @apiBody  {String} arrival_time Arrival time of the new flight.
 * @apiBody  {String} gate Gate of the new flight.
 * @apiBody  {Boolean} scheduled Whether new flight is scheduled.
 * 
 * @apiSuccess {Integer} id Id of the new flight.
 * @apiSuccess {String} flight_number Flight number of the new flight.
 * @apiSuccess {String} airline Airline of the new flight.
 * @apiSuccess {String} origin Origin of the new flight.
 * @apiSuccess {String} destination Destination of the new flight.
 * @apiSuccess {String} departure_time Departure time of the new flight.
 * @apiSuccess {String} arrival_time Arrival time of the new flight.
 * @apiSuccess {String} gate Gate of the new flight.
 * @apiSuccess {Boolean} scheduled Whether new flight is scheduled.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *        "scheduled": false,
 *        "id": 24,
 *        "flight_number": "Test9",
 *        "airline": "Testing",
 *        "origin": "JFK",
 *        "destination": "SEA",
 *        "departure_time": "2025-07-17T08:30:00.000Z",
 *        "arrival_time": "2025-07-17T11:45:00.000Z",
 *        "gate": "A13"
 *     }
 * 
 * @apiError (Error 409) Conflict Flight already exists or gate occupied.
 * 
 * @apiErrorExample {json} 409-Error-Response:
 *      HTTP/1.1 409 Conflict Error
 *       {
 *         "message": "Error: Flight already exists",
 *         "error": {
 *           "flight_number_exists": true,
 *           "flight_gate_exists": true
 *         }
 *       }
 * 
 * @apiError BadRequest Unable to create flight.
 * 
 * @apiErrorExample {json} 4xx-Error-Response:
 *      HTTP/1.1 400 Bad Request Error
 *      {
 *        "Error": "Failed: unable to create flight."
 *      }
 */
exports.createFlight = async (req, res) =>
{
  new_flight_number = req.body.flight_number;
  new_flight_gate = req.body.gate;
  try 
  {
    // retrieve flights that match specified flight number or gate
    const exists = await sequelize.query
    ('SELECT * FROM flights WHERE flight_number = ? OR gate = ?',
      {
        replacements: [new_flight_number, new_flight_gate],
        type: sequelize.QueryTypes.SELECT
      });
    
    // Check if flight already exists
    if(exists.length > 0)
    {
      const existing_flight = exists[0];

      // return response of whether flight number or gate already exists
      const error =
      {
        flight_number_exists: existing_flight.flight_number.toLowerCase() === new_flight_number.toLowerCase(),
        flight_gate_exists: existing_flight.gate.toLowerCase() === new_flight_gate.toLowerCase()
      };
      return res.status(409).json({message: 'Error: Flight already exists', error});
    }

    const newFlight = await Flight.create(req.body);
    res
    .status(201)
    .set('Content-Type', 'application/json')
    .set('Cache-Control', 'no-cache')
    .json(newFlight);
  } 
  catch (err)
  {
    res.status(400).json({Error: "Failed: unable to create flight.", error: err.message});
  }
};


/**
 * @api {put} /admin/:id Update Flight
 * @apiName UpdateFlight
 * @apiGroup Admin
 * 
 * @apiParam {Integer} id Flights unique id.
 * 
 * @apiBody  {Integer} id Id of the updated flight.
 * @apiBody  {String} flight_number Flight number of the updated flight.
 * @apiBody  {String} airline Airline of the updated flight.
 * @apiBody  {String} origin Origin of the updated flight.
 * @apiBody  {String} destination Destination of the updated flight.
 * @apiBody  {String} departure_time Departure time of the updated flight.
 * @apiBody  {String} arrival_time Arrival time of the updated flight.
 * @apiBody  {String} gate Gate of the updated flight.
 * @apiBody  {Boolean} scheduled Whether updated flight is scheduled.
 * 
 * @apiSuccess {Integer} id Id of the updated flight.
 * @apiSuccess {String} flight_number Flight number of the updated flight.
 * @apiSuccess {String} airline Airline of the updated flight.
 * @apiSuccess {String} origin Origin of the updated flight.
 * @apiSuccess {String} destination Destination of the updated flight.
 * @apiSuccess {String} departure_time Departure time of the updated flight.
 * @apiSuccess {String} arrival_time Arrival time of the updated flight.
 * @apiSuccess {String} gate Gate of the updated flight.
 * @apiSuccess {Boolean} scheduled Whether updated flight is scheduled.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "id": 24,
 *        "flight_number": "Test9",
 *        "airline": "Testing",
 *        "origin": "JFK",
 *        "destination": "SEA",
 *        "departure_time": "2025-07-17T08:30:00.000Z",
 *        "arrival_time": "2025-07-17T11:45:00.000Z",
 *        "gate": "A19",
 *        "scheduled": false
 *     }
 * 
 * @apiError (Error 409) Conflict Flight already exists or gate occupied.
 * 
 * @apiErrorExample {json} 409-Error-Response:
 *      HTTP/1.1 409 Conflict Error
 *       {
 *         "message": "Error: Flight already exists",
 *         "error": {
 *           "flight_number_exists": false 
 *           "flight_gate_exists": true
 *         }
 *       }
 * 
 * @apiError (Error 404) FlightNotFound The Flight was not found.
 * 
 * @apiErrorExample {json} 404-Error-Response:
 *      HTTP/1.1 404 Bad Flight Not Found Error
 *      {
 *        "Error": "Failed: unable to update flight."
 *      }
 * 
 * @apiError BadRequest Unable to update flight.
 * 
 * @apiErrorExample {json} 4xx-Error-Response:
 *      HTTP/1.1 400 Bad Request Error
 *      {
 *        "Error": "Failed: unable to update flight."
 *      }
 */
exports.updateFlight = async (req, res) => 
{
  new_flight_number = req.body.flight_number;
  new_flight_gate = req.body.gate;
  new_flight_id = parseInt(req.params.id);
  try 
  {
    const exists = await sequelize.query
    ('SELECT * FROM flights WHERE id <> ? AND (gate = ? OR flight_number = ?)',
      {
        replacements: [new_flight_id, new_flight_gate, new_flight_number],
        type: sequelize.QueryTypes.SELECT
      });
    
    // Check if flight already exists
    if(exists.length > 0)
    {
      const existing_flight = exists[0];

      // return response of whether flight number or gate already exists
      const error =
      {
        // toLowerCase() used because db has case insensitive settings. Might remove insensitive
        flight_number_exists: existing_flight.flight_number.toLowerCase() === new_flight_number.toLowerCase(), 
        flight_gate_exists: existing_flight.gate.toLowerCase() === new_flight_gate.toLowerCase()
      };
      return res.status(409).json({message: 'Error: Flight already exists', error});
    }

    const flight = await Flight.findByPk(req.params.id);
    if (flight) 
    {
      await flight.update(req.body);
      res
      .status(200)
      .set('Content-Type', 'application/json')
      .set('Cache-Control', 'no-cache')
      .set('FlightId', req.params.id)
      .json(flight);
    } 
    else res.status(404).json({Error: "Failed: flight not found."});
  } 
  catch (err)
  {
    res.status(400).json({message: 'Error updating flight', error: err.message});
  }
};


/**
 * @api {patch} /admin/:id/gate Update Flight Gate
 * @apiName UpdateFlightGate
 * @apiGroup Admin
 * 
 * @apiParam {Integer} id Flights unique id.
 * 
 * @apiBody  {String} gate Flights new gate.
 * 
 * @apiSuccess {Integer} id Id of the updated flight.
 * @apiSuccess {String} flight_number Flight number of the updated flight.
 * @apiSuccess {String} airline Airline of the updated flight.
 * @apiSuccess {String} origin Origin of the updated flight.
 * @apiSuccess {String} destination Destination of the updated flight.
 * @apiSuccess {String} departure_time Departure time of the updated flight.
 * @apiSuccess {String} arrival_time Arrival time of the updated flight.
 * @apiSuccess {String} gate Gate of the updated flight.
 * @apiSuccess {Boolean} scheduled Whether updated flight is scheduled.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "id": 22,
 *         "flight_number": "test5",
 *         "airline": "awedwa",
 *         "origin": "JFK",
 *         "destination": "SEA",
 *         "departure_time": "2025-07-25T04:36:00.000Z",
 *         "arrival_time": "2025-07-27T04:37:00.000Z",
 *         "gate": "A15",
 *         "scheduled": false
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
 * @apiError BadRequest Unable to update flight.
 * 
 * @apiErrorExample {json} 4xx-Error-Response:
 *      HTTP/1.1 400 Bad Request Error
 *      {
 *        "Error": "Error updating flight: 27"
 *      }
 */
exports.updateFlightByIdGate = async (req, res) =>
{
  try
  {
    const flight = await Flight.findByPk(req.params.id)
    if(flight)
    {
      const occupied = await Flight.findOne({where:{gate: req.body.gate}});
      if(occupied) return res.status(409).json({message: `Error: Gate ${req.body.gate} occupied`});
      flight.gate = req.body.gate;
      await flight.save();
      res
      .status(200)
      .set('Content-Type', 'application/json')
      .set('Cache-Control', 'no-cache')
      .set('FlightId', req.params.id)
      .set('gate', req.body.gate)
      .json(flight);
    }
    else
    {
      res.status(404).json({Error: "Failed: flight not found."});
    }
  }
  catch(err)
  {
    res.status(400).json({Error: `Error updating flight: ${req.params.id}`, error: err.message});
  }
}


/**
 * @api {delete} /admin/:id Delete Flight
 * @apiName DeleteFlight
 * @apiGroup Admin
 * 
 * @apiParam {Integer} id Flights unique id.
 * 
 * @apiSuccess {String} successMessage message object stating flight deleted
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "Success": "Flight deleted"
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
 * @apiError BadRequest Unable to update flight.
 * 
 * @apiErrorExample {json} 4xx-Error-Response:
 *      HTTP/1.1 400 Bad Request Error
 *      {
 *        "Error": "Failed: error deleting flight"
 *      }
 */
exports.deleteFlight = async (req, res) => 
{
  try 
  {
    const deleted = await Flight.destroy({ where: { id: req.params.id } });
    if (deleted)
      {
        res
        .status(200)
        .set('Content-Type', 'application/json')
        .set('Cache-Control', 'no-cache')
        .set('FlightId', req.params.id)
        .json({Success: 'Flight deleted' });
      } 
    else res.status(404).json({Error: "Failed: flight not found."});
  } 
  catch (err) 
  {
    res.status(500).json({Error: "Failed: error deleting flight"});
  }
};
