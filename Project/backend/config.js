const mysql = require(`mysql2`);
const dotenv = require(`dotenv`);
dotenv.config();

// create connection to airport_system_db
const connection = mysql.createConnection
({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER, // Change to local machine
  password: process.env.MYSQL_PASSWORD, // Change to local machine
  database: process.env.MYSQL_DATABASE
});

// run connection
connection.connect((err) =>
{
  // unsuccess
  if(err) 
  {
    console.error(`Error: there was an error connection to airport_system_db:`, err.stack);
    throw err;
  }
  // success
  console.log(`Backend is now connected to: ${connection.config.database}.`);
});


// export connection
module.exports = connection;

