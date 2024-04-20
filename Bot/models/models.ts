const { DataTypes } = require('sequelize')
const db = require('../db')

const DataBasePost = db.define('DataBasePost', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

})

module.exports = {
	DataBasePost
}