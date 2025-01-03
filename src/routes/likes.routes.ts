import express from 'express'
import { TokenType } from '~/constants/enums'
import likesController from '~/controllers/likes.controllers'
import asyncHandler from '~/middlewares/asyncHandler'
import { verifiedUserValidator, verifyToken } from '~/middlewares/jwtMiddleware'
import { validate } from '~/middlewares/validate'
import { TweetBookmarkSchema } from '~/schema/tweet/bookmark'

const router = express.Router()

router.post(
  '/',
  verifyToken(TokenType.AccessToken),
  verifiedUserValidator,
  validate(TweetBookmarkSchema),
  asyncHandler(likesController.likeTweetController)
)

router.delete(
  '/',
  verifyToken(TokenType.AccessToken),
  verifiedUserValidator,
  validate(TweetBookmarkSchema),
  asyncHandler(likesController.unlikeTweetController)
)

export default router
