const { DataTypes } = require('sequelize')
const db = require('../db')

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
	dataBasePost,
  imageData
}