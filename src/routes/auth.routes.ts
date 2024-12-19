import express from 'express'
import authController from '~/controllers/auth.controllers'
import { verifyToken } from '~/middlewares/jwtMiddleware'
import { validate } from '~/middlewares/validate'
import { LoginUserSchema } from '~/schema/user/login.schema'
import { RegisterUserSchema } from '~/schema/user/register.schema'
const router = express.Router()

router.post('/register', validate(RegisterUserSchema), authController.register)

router.post('/login', validate(LoginUserSchema), authController.login)

router.post('/logout', verifyToken, authController.logout)

export default router
