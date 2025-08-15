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

// Get customer userid given username and password (login functionality)
exports.getCustomerLogin = (req, res) =>
{
  const username = req.body.username;
  const password = req.body.password;
  connection.query('SELECT user_id FROM authentication WHERE username = ? AND password = ?',
    [username, password], 
    (err, user) =>
    {
      // if err catch issue with db or server
      if(err)
      {
        console.error(err);
        return res.status(500).json({Error: 'Database Error'});
      }
      // if no users then incorrect credentials
      if(user <= 0) 
      {
        return res.status(401).json({Error: `Invalid credentials`});
      }

      res.status(200).json({user_id: user[0].user_id}); 
    }
  );
}

// Create signup call