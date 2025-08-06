const {DataTypes} = require('sequelize');
const sequelize = require('../config');

const Flight = sequelize.define('Flight', 
{
  flight_number: {type: DataTypes.STRING, allowNull: false},
  airline: {type: DataTypes.STRING, allowNull: false},
  origin: {type: DataTypes.STRING, allowNull: false},
  destination: {type: DataTypes.STRING, allowNull: false},
  departure_time: {type: DataTypes.DATE, allowNull: false},
  arrival_time: {type: DataTypes.DATE, allowNull: false},
  gate: DataTypes.STRING,
  scheduled: {type: DataTypes.BOOLEAN, defaultValue: false},
}, 
{
  tableName: 'flights',
  timestamps: false
});

module.exports = Flight;
