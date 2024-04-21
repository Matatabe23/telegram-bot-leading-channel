require('dotenv').config()
const sequelize = require('./db')
const express = require('express')
const models = require('./models/models')
const TelegramBot = require('./routerBot/index')

const cors = require('cors')
const router = require('./router/index')

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', router)

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  } catch (e) {
    console.log(e)
  }
}

start()


const { dataBasePost, imageData } = require('./models/models');
const fs = require('fs');

async function saveImagesWithPost(images) {
  try {
    const post = await dataBasePost.create();

    const postId = post.id;

    for (const imagePath of images) {

      await imageData.create({
        image: fs.readFileSync(imagePath),
        dataBasePostId: postId
      });
    }

    console.log('Фотографии успешно сохранены и связаны с постом.');
  } catch (error) {
    console.error('Ошибка при сохранении фотографий и связи с постом:', error);
  }
}

const images = [
  './image/5.png',
  './image/6.png'
];
// saveImagesWithPost(images);
