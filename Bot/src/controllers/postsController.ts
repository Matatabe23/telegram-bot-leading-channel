import multer from 'multer'
import { dataBasePost, imageData } from '../models/models.js'
import { instantPublicationPosts } from '../routerBot/instantPublicationPosts.js'
import { multerPath } from '../const/const.js'
import { uploadImageToS3 } from '../service/s3-service.js'
import addWatermark from '../service/waterMark-service.js'
import { Request, Response } from 'express';
import { deleteImageFromS3 } from '../service/s3-service.js'
import { S3_BUCKET_NAME, S3_PATH } from "../const/constENV.js";

import {publication} from '../service/postsService/publication/publication.js'
import {instantPublicationPost} from '../service/postsService/instantPublicationPosts/instantPublicationPosts.js'
import {receiving} from '../service/postsService/receiving/receiving.js'
import {deletePost} from '../service/postsService/deletePost/deletePost.js'
import {publishInstantly} from '../service/postsService/publishInstantly/publishInstantly.js'
import {receivingPost} from '../service/postsService/receivingPost/receivingPost.js'


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

        const files: any = req.files
        const waterMark = JSON.parse(req.body.waterMark)

        const result = await publication(files, waterMark)

        res.send(result)
      })
    } catch (error) {
      console.error(error)
      res.status(500).send('Server Error')
    }
  }

  async instantPublicationPosts(req: Request, res: Response) {
    try {
      upload.array('files[]')(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
          console.error('Multer error:', err)
          return res.status(500).send('Multer Error')
        } else if (err) {
          console.error('Error:', err)
          return res.status(500).send('Server Error')
        }

        const files: any = req.files
        const waterMark = JSON.parse(req.body.waterMark)

        const result = await instantPublicationPost(files, waterMark)
        res.send(result);
      })
    } catch (error) {
      console.error(error)
      res.status(500).send('Server Error')
    }
  }

  async receiving(req: Request, res: Response) {
    try {
      const page = req.query.page ? parseInt(req.query.page.toString()) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize.toString()) : 10;
  
      const result = await receiving(page, pageSize)
  
      res.send({ ...result });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }
  
  async deletePost(req: Request, res: Response) {
    try {
      const { id } = req.params;
 
      const result = await deletePost(id);

      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }

  async publishInstantly(req: Request, res: Response) {
    try {
      const { id } = req.params;
  
      const result = await publishInstantly(id)
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }

  async receivingPost(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await receivingPost(id)

      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }
}

export default new PostsController()
