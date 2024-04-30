import { DataTypes } from 'sequelize'
import db from '../db.js'
import { EAdministratorRole } from '../type/types.js'

const administrators = db.define('administrators', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: {
    type: DataTypes.STRING,
    unique: true,
    set(value: string) {
      this.setDataValue('name', value.toLowerCase());
    },
  },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: EAdministratorRole.USER },
})

const dataBasePost = db.define('dataBasePost', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

const imageData = db.define('imageData', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  image: { type: DataTypes.STRING },
})

dataBasePost.hasMany(imageData);
imageData.belongsTo(dataBasePost);

export { administrators, dataBasePost, imageData }
