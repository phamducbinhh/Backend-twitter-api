import express from 'express'
import { TokenType } from '~/constants/enums'
import tweetController from '~/controllers/tweet.controllers'
import asyncHandler from '~/middlewares/asyncHandler'
import { verifiedUserValidator, verifyToken } from '~/middlewares/jwtMiddleware'
import { validate } from '~/middlewares/validate'
import { TweetSchema } from '~/schema/tweet/tweet'

const router = express.Router()

router.post(
  '/',
  verifyToken(TokenType.AccessToken),
  verifiedUserValidator,
  validate(TweetSchema),
  asyncHandler(tweetController.createTweet)
)

router.get('/:id', verifyToken(TokenType.AccessToken), asyncHandler(tweetController.getTweetDetail))

export default router
