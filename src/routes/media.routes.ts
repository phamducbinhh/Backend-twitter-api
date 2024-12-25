import express from 'express'
import { TokenType } from '~/constants/enums'
import mediaController from '~/controllers/media.controllers'
import asyncHandler from '~/middlewares/asyncHandler'
import { verifiedUserValidator, verifyToken } from '~/middlewares/jwtMiddleware'

const router = express.Router()

router.post(
  '/upload-image',
  verifyToken(TokenType.AccessToken),
  verifiedUserValidator,
  asyncHandler(mediaController.uploadImageMedia)
)

export default router
