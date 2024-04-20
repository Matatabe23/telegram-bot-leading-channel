const sqlite3 = require('sqlite3').verbose();
const Sequelize = require('sequelize')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './Main.db'
});

module.exports = sequelize;