import express from 'express'
import userController from '~/controllers/user.controllers'
import asyncHandler from '~/middlewares/asyncHandler'
import { verifyToken } from '~/middlewares/jwtMiddleware'
const router = express.Router()

router.post('/verify-email', verifyToken, asyncHandler(userController.verifyEmail))

router.post('/resend-verify-email', verifyToken, asyncHandler(userController.resendVerifyEmail))

export default router
