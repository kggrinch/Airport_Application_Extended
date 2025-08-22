# Airport System Web Service API

## Overview
This web service API consists of two main services:
1. User Authetication
2. Customer Flight Management

## Installation/Running Services
**Installation 
  1. In VS code open project in workspace, and open the terminal.
  2. In the terminal navigate to backend directory located at: Airport_Application/Project/backend
       * cd backend
  4. Run the following commands to initialize the project and install required dependencies (express, nodemon, mysql2, cors, dotenv):
       * npm install

       * If setting up project from scratch run the following commands:
           * npm init -y
           * npm i express nodemon mysql2 cors dotenv

**Importing database
  1. Install MySQL Workbench and create new server connection.
  2. Save username and password as it will be used to connect to the application.
  3. Locate database file in the project folder located at: Airport_Application/db_scripts/phase_3_sql_script_db_creation_w_queries_and_authetication
  4. In MySQL Workbench import the db_script file
    
**To run Airport System Web Service API
  1. Open the config.js file located at: Airport_Application/Project/backend/config.js
  2. The application uses an .env file to manage multiple connections to sql. To run this on local machine either:
       a. Create a .env file with information pertaining to your local machine
       OR
       b. Update the user: and password: lines with your unique user and password within the create mysql connection server (refer to step 2 of "Importing databse")

       * If (option a) creating .env file follow these steps for set up:
         1. Create a .env file within the backend folder
         2. Inside the .env file copy this code and change the following:
            MYSQL_HOST='localhost'
            MYSQL_USER='Your MySQL server user here'
            MYSQL_PASSWORD='Your MySQL server connection password here'
            MYSQL_DATABASE='airport_system_db'
         3. Insert your MySQL server user inside the single quotes of MYSQL_USER.
         4. Insert your MySQL server password inside the single quotes of MYSQL_PASSWORD.
         5. For reference this is how a .env file can look like:
              MYSQL_HOST='localhost'
              MYSQL_USER='root'
              MYSQL_PASSWORD='root'
              MYSQL_DATABASE='airport_system_db'
            
  2. Ensure that your package.json has the following script for starting the Airport System Web Service:
    "scripts": {
    "start": "nodemon index.js"
  }

  3. In the terminal navigate to backend directory (refer to part 2 of Installation) and run the following command to start the Airport System Web Service:
       npm start

  4. If you see:
       Server running at http://localhost:3000
       Backend is now connected to: airport_system_db
     The connection is successful and backend is set and running.

## Features
*User Authetication
  - This service manages the login section of the application

*Customer Flight Management
  - This service provide customer flight management.
  - Viewing flights with filters
  - Booking/Reserving flight seats
  - View current bookings and reservations

## Data utilized 
*The data utilized in this web service API is sourced from the ChatGPT OpenAI, which contains collection of sample flight data modified by contributors.

## AI Usage
* ChatGPT OpenAI generation tool was used to generate the sample data found within the database script. All sample data was sourced from ChatGPT OpenAI.



