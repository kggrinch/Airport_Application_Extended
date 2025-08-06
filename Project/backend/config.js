const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('airport_sys', 'airport_sys_user', 'mypassword',
{
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

module.exports = sequelize;
