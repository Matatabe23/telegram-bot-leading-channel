import multer from 'multer'
import { multerPath } from '../const/const.js'
import { Request, Response } from 'express';

import { publication } from '../service/postsService/publication/publication.js'
import { instantPublicationPost } from '../service/postsService/instantPublicationPosts/instantPublicationPosts.js'
import { receiving } from '../service/postsService/receiving/receiving.js'
import { deletePost } from '../service/postsService/deletePost/deletePost.js'
import { publishInstantly } from '../service/postsService/publishInstantly/publishInstantly.js'
import { receivingPost } from '../service/postsService/receivingPost/receivingPost.js'
import { changePage } from '../service/postsService/changePage/changePage.js'
import { deleteSelectedImgs } from '../service/postsService/deleteSelectedImgs/deleteSelectedImgs.js'
import { editPostLinkСhannels } from '../service/postsService/editPostLinkСhannels/editPostLinkСhannels.js'

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
        const chatIdList = req.body.chatIdList.split(',')

        const result = await publication(files, waterMark, chatIdList)

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
        const waterMark = JSON.parse(req.body.waterMark);
        const chatIdList = req.body.chatIdList.split(',');

        const result = await instantPublicationPost(files, waterMark, chatIdList)
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
      const watched = req.query.watched;

      const result = await receiving(page, pageSize, watched)

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

  async changePage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { where, watched } = req.query

      const result = await changePage(id, where, watched);

      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }

  async deleteSelectedImgs(req: Request, res: Response) {
    try {
      const { idList } = req.query

      const result = await deleteSelectedImgs(idList);

      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }

  async editPostLinkСhannels(req: Request, res: Response) {
    try {
      const { postId, channelIds } = req.body.params

      const result = await editPostLinkСhannels(postId, channelIds);

      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }
}

export default new PostsController()
