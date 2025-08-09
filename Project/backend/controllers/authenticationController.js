const connection = require('../config');

// Get all customers
exports.getAllCustomers = (req, res) => {
  connection.query('SELECT * FROM customer', (err, customers) => 
  {
    if (err) 
    {
      console.error(err);
      return res.status(500).json({ Error: 'Error fetching customers' });
    }
    res
      .status(200)
      .set('Content-Type', 'application/json')
      .set('Cache-Control', 'no-cache')
      .json(customers);
  });
};
// Create login call

// Create signup call