const { Posts } = require('../models/models');
const multer = require('multer');
const { dataBasePost, imageData } = require('../models/models');
const fs = require('fs');

const upload = multer({ dest: 'image/' });

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

        for (const file of files) {
          await imageData.create({
            image: fs.readFileSync(file.path),
            dataBasePostId: postId
          });


          fs.unlink(`${file.destination}${file.filename}`, (err: any) => {
            if (err) {
              console.error('Ошибка при удалении файла:', err);
            } else {
              console.log('Файл успешно удален:', file.path);
            }
          });
        }
        

        res.send(files);
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

      res.send();
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