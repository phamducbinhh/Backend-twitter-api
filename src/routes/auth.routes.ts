import express from 'express'
import { TokenType } from '~/constants/enums'
import authController from '~/controllers/auth.controllers'
import asyncHandler from '~/middlewares/asyncHandler'
import { verifyToken } from '~/middlewares/jwtMiddleware'
import { validate } from '~/middlewares/validate'
import { LoginUserSchema } from '~/schema/user/login.schema'
import { RegisterUserSchema } from '~/schema/user/register.schema'
const router = express.Router()

router.post('/register', validate(RegisterUserSchema), asyncHandler(authController.register))

router.post('/login', validate(LoginUserSchema), asyncHandler(authController.login))

router.post('/logout', verifyToken(TokenType.AccessToken), asyncHandler(authController.logout))

router.post('/refresh-token', verifyToken(TokenType.RefreshToken), asyncHandler(authController.refreshToken))

export default router
