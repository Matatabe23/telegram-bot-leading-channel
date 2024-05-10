import { Router } from 'express'
const router = Router()
import settingsController from '../controllers/settingsController.js'
import authMiddleware from '../middleware/authMiddleware.js'

router.post('/addingPublicationTime', authMiddleware, settingsController.addingPublicationTime)
router.get('/getListRegularPublicationTimes', authMiddleware, settingsController.getListRegularPublicationTimes)
router.delete('/deleteItemPublicationTimes/:id', authMiddleware, settingsController.deleteItemPublicationTimes)

export default router
