const express = require('express');
const cors = require('cors');
// const adminRoutes = require('./routes/admin');
const customerRoutes = require('./routes/customer');
const connection = require(`./config`);

const app = express();

// Connect middleware
app.use(cors()); // set cross browser communication
app.use(express.json()); // set communication via json
app.use((err, req, res, next) => // set error handling
{
  console.log(err.stack);
  res.status(500).send(`Error!`);
});

// Routes
// app.use('/admin', adminRoutes);
app.use('/customer', customerRoutes);

app.listen(3000, () =>
{
  console.log(`Server running at http://localhost:3000`)
})