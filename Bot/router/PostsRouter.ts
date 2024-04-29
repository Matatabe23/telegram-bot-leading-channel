const Router = require('express')
const router = new Router()
const postsController = require('../controllers/postsController')
const authMiddleware = require('../middleware/authMiddleware')
// const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

router.post('/publication', authMiddleware, postsController.publication )
router.put('/editing', authMiddleware, postsController.editing )
router.get('/receiving', authMiddleware, postsController.receiving )
router.delete('/delete', authMiddleware, postsController.delete)

module.exports = router 