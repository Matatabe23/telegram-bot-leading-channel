const sqlite3 = require('sqlite3').verbose();
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './Main.db'
});

module.exports = sequelize;