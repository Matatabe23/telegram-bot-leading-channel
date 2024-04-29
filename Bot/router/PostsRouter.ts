const Router = require('express')
const router = new Router()
const postsController = require('../controllers/postsController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

router.post('/publication', authMiddleware, checkRoleMiddleware, postsController.publication )
router.put('/editing', authMiddleware, checkRoleMiddleware, postsController.editing )
router.get('/receiving', authMiddleware, checkRoleMiddleware, postsController.receiving )
router.delete('/delete', authMiddleware, checkRoleMiddleware, postsController.delete)

module.exports = router 