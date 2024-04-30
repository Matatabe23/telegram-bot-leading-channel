const multer = require('multer');
const { dataBasePost, imageData } = require('../models/models');
const fs = require('fs');
const { instantPublicationPosts } = require('../routerBot/instantPublicationPosts')
import { multerPath } from '../const/const'
import {uploadImageToS3} from '../service/s3-service'

const upload = multer({ dest: multerPath });

class PostsController {
  async publication(req: any, res: any) {
    try {
      const post = await dataBasePost.create();
      const postId = post.id;

      upload.array('files[]')(req, res, async (err: any) => {
        if (err instanceof multer.MulterError) {
          console.error('Multer error:', err);
          return res.status(500).send('Multer Error');
        } else if (err) {
          console.error('Error:', err);
          return res.status(500).send('Server Error');
        }

        const files = req.files;
        const waterMark = JSON.parse(req.body.waterMark);
        const instantPublication = JSON.parse(req.body.instantPublication);

        if (instantPublication === true) {
          await instantPublicationPosts(files);
          res.send('Успешная моментальная публикация')
          return
        }

        for (const file of files) {
          uploadImageToS3(file.path, 'QugorArtsTelegramBot')

          // await imageData.create({
          //   image: fs.readFileSync(file.path),
          //   dataBasePostId: postId
          // });

          fs.unlink(`${file.destination}${file.filename}`, (err: any) => {
            if (err) {
              console.error('Ошибка при удалении файла:', err);
            } else {
              console.log('Файл успешно удален:', file.path);
            }
          });
        }

        res.send('Успешное сохранение в базу данных!');
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }

  async editing(req: any, res: any) {
    try {

      res.send();
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }

  async receiving(req: any, res: any) {
    try {
      const { page, pageSize } = req.query;
      const offset = (page - 1) * pageSize;

      const posts = await dataBasePost.findAll({
        include: [{
          model: imageData,
          limit: 1
        }],
        limit: parseInt(pageSize),
        offset: offset
      });
      const totalCount = await dataBasePost.count();

      res.send({ posts, totalCount });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }


  async delete(req: any, res: any) {
    try {
      const { id } = req.body;

      res.send('Пост успешно удален');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }
}

module.exports = new PostsController();