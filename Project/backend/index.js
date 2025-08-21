const express = require('express');
const cors = require('cors');
const customerRoutes = require('./routes/customer');
const authenticationRoutes = require('./routes/authentication');

const app = express();

// Connect middleware
app.use(cors());
app.use(express.json()); 
app.use((err, req, res, next) => 
{
  console.log(err.stack);
  res.status(500).send(`Error!`);
});

// Routes
app.use(`/authentication`, authenticationRoutes);
app.use('/customer', customerRoutes);

app.listen(3000, () =>
{
  console.log(`Server running at http://localhost:3000`)
})