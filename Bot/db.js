const sqlite3 = require('sqlite3').verbose();
const Sequelize = require('sequelize')

const sequelize = new Sequelize({
  dialect: process.env.DB_TYPE,
  storage: process.env.DB_PATH
});

module.exports = sequelize;