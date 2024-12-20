import express from 'express'
import userController from '~/controllers/user.controllers'
import asyncHandler from '~/middlewares/asyncHandler'
import { verifyToken } from '~/middlewares/jwtMiddleware'
import { validate } from '~/middlewares/validate'
import { ForgotPasswordSchema } from '~/schema/user/forgot-password'
import { ResetPasswordSchema } from '~/schema/user/reset-password'
import { VerifyEmailSchema } from '~/schema/user/verify-email'
const router = express.Router()

router.post('/verify-email', verifyToken, validate(VerifyEmailSchema), asyncHandler(userController.verifyEmail))

router.post('/resend-verify-email', verifyToken, asyncHandler(userController.resendVerifyEmail))

router.post('/forgot-password', validate(ForgotPasswordSchema), asyncHandler(userController.forgotPassword))

router.post('/reset-password', validate(ResetPasswordSchema), asyncHandler(userController.resetPassword))

export default router
