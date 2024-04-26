const { Posts } = require('../models/models');

class PostsController {
  async publication(req: any, res: any) {
    try {
      const posts = req.body
      console.log(posts)

      res.send();
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