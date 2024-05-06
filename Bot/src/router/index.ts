import { Router } from 'express'
const router = Router()
import administratorRouter from './administratorRouter.js'
import postsRouter from './PostsRouter.js'
import settingsRouter from './settingsRouter.js'

router.use('/admin', administratorRouter)
router.use('/posts', postsRouter)
router.use('/settings', settingsRouter)

export default router
