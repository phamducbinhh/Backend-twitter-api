import express from 'express'
import { TokenType } from '~/constants/enums'
import userController from '~/controllers/user.controllers'
import asyncHandler from '~/middlewares/asyncHandler'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { verifiedUserValidator, verifyToken } from '~/middlewares/jwtMiddleware'
import { validate } from '~/middlewares/validate'
import { ChangePasswordSchema } from '~/schema/user/change-password'
import { FollowSchema } from '~/schema/user/follow'
import { ForgotPasswordSchema } from '~/schema/user/forgot-password'
import { ResetPasswordSchema } from '~/schema/user/reset-password'
import { UpdateProfileSchema } from '~/schema/user/update-profile'
import { VerifyEmailSchema } from '~/schema/user/verify-email'
import { UpdateMeReqBody } from '~/types/users.type'
const router = express.Router()

router.post(
  '/verify-email',
  verifyToken(TokenType.EmailVerifyToken),
  validate(VerifyEmailSchema),
  asyncHandler(userController.verifyEmail)
)

router.post('/resend-verify-email', verifyToken(TokenType.AccessToken), asyncHandler(userController.resendVerifyEmail))

router.post('/forgot-password', validate(ForgotPasswordSchema), asyncHandler(userController.forgotPassword))

router.post(
  '/reset-password',
  verifyToken(TokenType.ForgotPasswordToken),
  validate(ResetPasswordSchema),
  asyncHandler(userController.resetPassword)
)

router.get('/profile', verifyToken(TokenType.AccessToken), asyncHandler(userController.getmetProfile))

router.post('/follow', verifyToken(TokenType.AccessToken), validate(FollowSchema), asyncHandler(userController.follow))

router.delete(
  '/unfollow',
  verifyToken(TokenType.AccessToken),
  validate(FollowSchema),
  asyncHandler(userController.unfollow)
)

router.patch(
  '/profile',
  verifyToken(TokenType.AccessToken),
  verifiedUserValidator,
  validate(UpdateProfileSchema),
  filterMiddleware<UpdateMeReqBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'username',
    'avatar',
    'cover_photo'
  ]),
  asyncHandler(userController.updateProfile)
)

router.put(
  '/change-password',
  verifyToken(TokenType.AccessToken),
  verifiedUserValidator,
  validate(ChangePasswordSchema),
  asyncHandler(userController.changePassword)
)

router.get('/following', verifyToken(TokenType.AccessToken), asyncHandler(userController.getFollowing))

router.get('/followers', verifyToken(TokenType.AccessToken), asyncHandler(userController.getFollowers))

router.get('/:username', verifyToken(TokenType.AccessToken), asyncHandler(userController.getProfile))

export default router
