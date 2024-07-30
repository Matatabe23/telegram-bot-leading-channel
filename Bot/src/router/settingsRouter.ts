import { Router } from 'express'
const router = Router()
import settingsController from '../controllers/settingsController.js'
import authMiddleware from '../middleware/authMiddleware.js'

router.post('/addingPublicationTime', authMiddleware, settingsController.addingPublicationTime)
router.get('/getListRegularPublicationTimes', authMiddleware, settingsController.getListRegularPublicationTimes)
router.delete('/deleteItemPublicationTimes/:id', authMiddleware, settingsController.deleteItemPublicationTimes)
router.post('/addingNewChannels', authMiddleware, settingsController.addingNewChannels)
router.get('/getListChannel', authMiddleware, settingsController.getListChannel)
router.delete('/deleteChannel/:id', authMiddleware, settingsController.deleteChannel)
router.put('/editChannel', authMiddleware, settingsController.editChannel)

export default router
