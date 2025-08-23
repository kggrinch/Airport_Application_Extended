const mysql = require(`mysql2`);
const dotenv = require(`dotenv`);
dotenv.config();

// This application uses an .env file to manage multiple connections to mysql workbench.
// To run this on local machine either:
// 1. create a .env file with information pertaining to your local machine 
// OR
// 2. change the user and password lines to your pertaining local machine

// create connection to airport_system_db
const connection = mysql.createConnection
({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER, // Change to local machine username
  password: process.env.MYSQL_PASSWORD, // Change to local machine password
  database: process.env.MYSQL_DATABASE
});

// run connection
connection.connect((err) =>
{
  // unsuccess
  if(err) 
  {
    console.error(`Error: there was an error connecting to airport_system_db:`, err.stack);
    throw err;
  }
  // success
  console.log(`Backend is now connected to: ${connection.config.database}.`);
});


// export connection
module.exports = connection;

