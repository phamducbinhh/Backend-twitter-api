import express from 'express'
import { TokenType } from '~/constants/enums'
import bookmarkController from '~/controllers/bookmark.controllers'
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
  asyncHandler(bookmarkController.createBookmark)
)

export default router
