import { Router } from 'express'
const router = Router()
import administratorRouter from './administratorRouter.js'
import postsRouter from './PostsRouter.js'

router.use('/admin', administratorRouter)
router.use('/posts', postsRouter)

export default router
