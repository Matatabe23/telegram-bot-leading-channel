import multer from 'multer'
import { dataBasePost, imageData } from '../models/models.js'
import { instantPublicationPosts } from '../routerBot/instantPublicationPosts.js'
import { multerPath } from '../const/const.js'
import { uploadImageToS3 } from '../service/s3-service.js'
import addWatermark  from '../service/waterMark-service.js'
import { Request, Response } from 'express'; 
import { deleteImageFromS3 } from '../service/s3-service.js'

const upload = multer({ dest: multerPath })

class PostsController {
  async publication(req: Request, res: Response) {
    try {
      upload.array('files[]')(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
          console.error('Multer error:', err)
          return res.status(500).send('Multer Error')
        } else if (err) {
          console.error('Error:', err)
          return res.status(500).send('Server Error')
        }

        const files:any = req.files

        const waterMark = JSON.parse(req.body.waterMark)
        const instantPublication = JSON.parse(req.body.instantPublication)

        if (instantPublication === true) {
          if (waterMark === true) {
            for (const file of files) {
              await addWatermark(file)
            }
          }

          await instantPublicationPosts(files)
          res.send('Успешная моментальная публикация')
          return
        }

        const post = await dataBasePost.create()
        const postId = post.dataValues.id

        for (const file of files) {
          let url: string
          if (waterMark === true) {
            await addWatermark(file)
            url = await uploadImageToS3(file)
          } else {
            url = await uploadImageToS3(file)
          }

          await imageData.create({
            image: url,
            dataBasePostId: postId
          })
        }

        res.send('Успешное сохранение в базу данных!')
      })
    } catch (error) {
      console.error(error)
      res.status(500).send('Server Error')
    }
  }

  async editing(req: Request, res: Response) {
    try {

      res.send()
    } catch (error) {
      console.error(error)
      res.status(500).send('Server Error')
    }
  }

  async receiving(req: Request, res: Response) {
    try {
      const page = req.query.page ? parseInt(req.query.page.toString()) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize.toString()) : 10; 
  
      if (isNaN(page) || isNaN(pageSize)) {
        return res.status(400).send('Неверный формат параметров запроса');
      }
  
      const offset = (page - 1) * pageSize;
  
      const posts = await dataBasePost.findAll({
        include: [{
          model: imageData,
          limit: 1
        }],
        limit: pageSize,
        offset: offset
      });
      const totalCount = await dataBasePost.count();
  
      res.send({ posts, totalCount });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }
  


  async deletePost(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const post = await dataBasePost.findByPk(id);
      if (!post) {
        return res.status(404).send('Пост не найден');
      }

      const images = await imageData.findAll({ where: { dataBasePostId: id } });

      for (const image of images) {
        console.log(image)
        deleteImageFromS3(image.dataValues.image)
      }

      await imageData.destroy({ where: { dataBasePostId: id } });

      await post.destroy();

      res.send('Пост успешно удален');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }
  
}

export default new PostsController()
