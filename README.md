# Airport System Web Service API

## Overview

This web service API consists of two main services:
1. Admin Flight Management
2. Customer Flight Scheduler

## Installation/Running Services
**Installation 
  - In VS code open project in workspace, and open the terminal.
  - In the terminal navigate to backend directory:
    cd backend

  - Run the following commands to initialize the project and install required dependencies (express, nodemon, mysql2, cors, sequelize):
    npm install

       * If setting up project from scratch run the following commands:
         npm init -y
         npm i express nodemon mysql2 cors sequelize

**Importing database and activating Apache
  - In XAMPP Control Panel start Apache and MySQL
  - Open Admin for MySQL to load in phpMyAdmin
  - Locate database file in the project folder located at Assignment3/README/airport_sys.sql
  - In phpMyAdmin:
    1. Go to Import > Choose File
    2. Insert airport_sys.sql script file and leave everything as default
    3. Click Import
    
**To run Airport System Web Service API
  - Ensure that your package.json has the following script for starting the Airport System Web Service:
    
    "scripts": {
    "start": "nodemon index.js"
  }

  - Then in the terminal run the following command to start the Airport System Web Service:
    npm start

  - If you see "Server running at http://localhost:3000" then connection is successful and backend is set and running.

  - Both Admin Flight Management and Customer Flight Scheduler are implemented within the same index.js file, therefore both will be active upon 'npm start' command.

*Admin Flight Management
  - This service manages flights and provides CRUD operations.

*Customer Flight Scheduler
  - This service provide customer flight scheduling via update operations.

## Data utilized 
*The data utilized in this web service API is sourced from the https://rowzero.io/datasets/us-flights-dataset, which contains collection of sample flight data modified by me.

## API Info
*The API html document was created using the generated apiDoc tool. 
*The API information is contained within an html document located at Assignment3/Project/backend/docs/index.html
  - The API document html file can also be accessed through the footer within the frontend application.

## AI Usage
*The Tabine AI generation tool was used as a learning assistant during the following parts of the project:
  - Setting up Sequelize to work with Mysql
  - Setting up apiDoc

*All AI assistance was minimal and used to support my learning. All core implementations, design decisions, and code developing was done independently by me.



