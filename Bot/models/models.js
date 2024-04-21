const { DataTypes } = require('sequelize')
const db = require('../db')
const {EAdministratorRole} = require('../types')

const administrators = db.define('administrators', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, require: true },
	password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: EAdministratorRole.USER },
})

const dataBasePost = db.define('dataBasePost', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

const imageData = db.define('imageData', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  image: { type: DataTypes.BLOB },
})

dataBasePost.hasMany(imageData);
imageData.belongsTo(dataBasePost);

module.exports = {
  administrators,
  dataBasePost,
  imageData
}