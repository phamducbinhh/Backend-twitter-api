import express from 'express'
import { TokenType } from '~/constants/enums'
import conversationsController from '~/controllers/conversation.controllers'
import asyncHandler from '~/middlewares/asyncHandler'
import { verifiedUserValidator, verifyToken } from '~/middlewares/jwtMiddleware'
import { validate } from '~/middlewares/validate'
import { ConversationSchema } from '~/schema/user/conversation'

const router = express.Router()

router.get(
  '/receivers/:receiver_id',
  verifyToken(TokenType.AccessToken),
  verifiedUserValidator,
  validate(ConversationSchema),
  asyncHandler(conversationsController.getConversations)
)

export default router
