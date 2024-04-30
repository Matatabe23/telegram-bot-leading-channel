import { Router } from 'express'
const router = Router()
import administratorController from '../controllers/administratorController.js'
import authMiddleware from '../middleware/authMiddleware.js'

router.post('/registration', administratorController.registration)
router.post('/login', administratorController.login)
router.get('/checkDataWeb', authMiddleware, administratorController.checkDataWeb)

export default router
