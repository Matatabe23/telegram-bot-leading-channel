import { Router } from 'express'
const router = Router()
import postsController from '../controllers/postsController.js'
import authMiddleware from '../middleware/authMiddleware.js'
// import checkRoleMiddleware from '../middleware/checkRoleMiddleware'

router.post('/publication', authMiddleware, postsController.publication)
router.put('/editing', authMiddleware, postsController.editing)
router.get('/receiving', authMiddleware, postsController.receiving)
router.delete('/deletePost/:id', authMiddleware, postsController.deletePost)

export default router
