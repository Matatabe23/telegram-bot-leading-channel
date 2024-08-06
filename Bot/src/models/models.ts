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

const dataBasePosts = db.define('dataBasePosts', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  watched: { type: DataTypes.BOOLEAN, defaultValue: false }
})

const imageData = db.define('imageData', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  image: { type: DataTypes.STRING },
})

const regularPublicationTime = db.define('regularPublicationTime', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  hour: { type: DataTypes.STRING },
  minute: { type: DataTypes.STRING }
})

const channels = db.define('channels', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  chatId: { type: DataTypes.STRING },
  settings: { type: DataTypes.STRING },
})

const ChannelPosts = db.define('ChannelPosts', {
  channelId: {
    type: DataTypes.INTEGER,
    references: {
      model: channels,
      key: 'id'
    },
    primaryKey: true
  },
  postId: {
    type: DataTypes.INTEGER,
    references: {
      model: dataBasePosts,
      key: 'id'
    },
    primaryKey: true
  }
})

dataBasePosts.hasMany(imageData);
imageData.belongsTo(dataBasePosts);

channels.hasMany(regularPublicationTime);
regularPublicationTime.belongsTo(channels);

channels.belongsToMany(dataBasePosts, { through: ChannelPosts });
dataBasePosts.belongsToMany(channels, { through: ChannelPosts });

export { administrators, dataBasePosts, imageData, regularPublicationTime, channels, ChannelPosts }
