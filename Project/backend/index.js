const express = require('express');
const cors = require('cors');
const adminRoutes = require('./routes/admin');
const customerRoutes = require('./routes/customer');

const sequelize = require('./config'); // change

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/admin', adminRoutes);
app.use('/customer', customerRoutes);

// Start server after DB connects
// Change
sequelize.sync().then(() =>
{
  console.log('Database synced');
  app.listen(3000, () => console.log('Server running at http://localhost:3000'));
})
.catch(err => 
  {
  console.error('DB connection failed:', err);
});
