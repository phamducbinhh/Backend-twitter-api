import express from 'express'
import mediaController from '~/controllers/media.controllers'

const router = express.Router()

router.post('/upload-media', mediaController.uploadMedia)

export default router
