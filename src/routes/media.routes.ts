import express from 'express'
import mediaController from '~/controllers/media.controllers'
import asyncHandler from '~/middlewares/asyncHandler'

const router = express.Router()

router.post('/upload-media', asyncHandler(mediaController.uploadImageMedia))

export default router
