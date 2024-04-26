const Router = require('express')
const router = new Router()
const postsController = require('../controllers/postsController')

router.post('/publication', postsController.publication )
router.put('/editing', postsController.editing )
router.get('/receiving', postsController.receiving )
router.delete('/delete', postsController.delete)

module.exports = router 