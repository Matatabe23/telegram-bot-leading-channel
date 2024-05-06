import { Router } from 'express'
const router = Router()
import settingsController from '../controllers/settingsController.js'
import authMiddleware from '../middleware/authMiddleware.js'

router.post('/addingPublicationTime', authMiddleware, settingsController.addingPublicationTime)

export default router
