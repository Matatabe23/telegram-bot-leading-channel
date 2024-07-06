import { Router } from 'express'
const router = Router()
import postsController from '../controllers/postsController.js'
import authMiddleware from '../middleware/authMiddleware.js'

router.post('/publication', authMiddleware, postsController.publication)
router.post('/instantPublicationPosts', authMiddleware, postsController.instantPublicationPosts)
router.get('/receiving', authMiddleware, postsController.receiving)
router.delete('/deletePost/:id', authMiddleware, postsController.deletePost)
router.post('/publishInstantly/:id', authMiddleware, postsController.publishInstantly)
router.get('/receivingPost/:id', authMiddleware, postsController.receivingPost)
router.get('/changePage/:id', authMiddleware, postsController.changePage)
router.get('/deleteSelectedImgs', authMiddleware, postsController.deleteSelectedImgs)

export default router
