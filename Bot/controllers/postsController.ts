const { Posts } = require('../models/models');

class PostsController {
	async push(req:any, res:any) {
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

			await Posts.destroy({ where: { id: id } });

			res.send('Пост успешно удален');
		} catch (error) {
			console.error(error);
			res.status(500).send('Server Error');
		}
	}
}

module.exports = new PostsController();