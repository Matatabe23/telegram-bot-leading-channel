import { Sequelize } from 'sequelize';
import { DB_HOST, DB_NAME, DB_ROOT_USER, DB_PASSWORD_USER } from './const/constENV.js';

const sequelize = new Sequelize(DB_NAME, DB_ROOT_USER, DB_PASSWORD_USER, {
  host: DB_HOST,
  dialect: 'mysql'
});

export default sequelize;
