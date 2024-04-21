const Router = require('express')
const router = new Router()
const postsController = require('../controllers/postsController')

router.post('/push', postsController.push )
router.post('/delete', postsController.delete)

module.exports = router 