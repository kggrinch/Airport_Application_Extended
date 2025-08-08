// initialize mysql2
const mysql = require(`mysql2`);

// local host
// initialize connection to airport_system_db
const connection = mysql.createConnection
({
  host: `localhost`,
  user: `root`,
  password: `JzPQpOmQ2)^a6`,
  database: `airport_system_db`
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
  console.log(`Backend is not connected to: ${connection.config.database}.`);
});


// export connection
module.exports = connection;

