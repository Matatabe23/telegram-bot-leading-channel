const Router = require('express')
const router = new Router()
const administratorRouter = require('./administratorRouter')
const PostsRouter = require('./postsRouter')

router.use('/admin', administratorRouter)
router.use('/posts', PostsRouter)

module.exports = router