import { UserVerifyStatus } from '~/constants/enums'
import { HttpStatusCode } from '~/constants/HttpStatusCode'
import { USERS_MESSAGES } from '~/constants/messages'
import { UserRespone } from '~/response/user'
import { ForgotPasswordReqBody, ResetPasswordReqBody, VerifyEmailReqBody } from '~/types/users.type'
import { hashPassword } from '~/utils/bcrypt'
import { generateEmailVerifyToken, generateForgotPasswordToken } from '~/utils/jwt'
import { handleResponse } from '~/utils/response'

const db = require('../models')

class UserServices {
  async verifyEmail({ body, id }: { body: VerifyEmailReqBody; id: string }) {
    const { email_verify_token } = body

    const user = await db.User.findOne({ where: { id, email_verify_token } })

    if (!user) {
      return handleResponse(HttpStatusCode.BAD_REQUEST, false, USERS_MESSAGES.EMAIL_VERIFY_TOKEN_IS_VALID)
    }
    if (user.verify_status === UserVerifyStatus.Verified) {
      return handleResponse(HttpStatusCode.SUCCESS, true, USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE)
    }

    await db.User.update(
      {
        email_verify_token: null,
        verify_status: UserVerifyStatus.Verified
      },
      {
        where: { id }
      }
    )

    return handleResponse(HttpStatusCode.SUCCESS, true, USERS_MESSAGES.EMAIL_VERIFY_SUCCESS)
  }
  async resendVerifyEmail({ id }: { id: string }) {
    const emailVerifyToken = generateEmailVerifyToken({ id })

    await db.User.update(
      {
        email_verify_token: emailVerifyToken
      },
      {
        where: { id }
      }
    )

    return handleResponse(HttpStatusCode.SUCCESS, true, USERS_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS)
  }
  async forgotPassword({ body }: { body: ForgotPasswordReqBody }) {
    const { email: userEmail } = body

    const user = await db.User.findOne({ where: { email: userEmail } })

    if (!user) {
      return handleResponse(HttpStatusCode.NOT_FOUND, false, USERS_MESSAGES.USER_NOT_FOUND)
    }

    const forgotPasswordToken = generateForgotPasswordToken({ id: user.id })

    await db.User.update(
      {
        forgot_password_token: forgotPasswordToken
      },
      {
        where: { id: user.id }
      }
    )

    return handleResponse(HttpStatusCode.SUCCESS, true, USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD)
  }
  async resetPassword({ body }: { body: ResetPasswordReqBody }) {
    const { forgot_password_token, password, confirm_password } = body

    const user = await db.User.findOne({ where: { forgot_password_token } })

    if (!user) {
      return handleResponse(HttpStatusCode.NOT_FOUND, false, USERS_MESSAGES.USER_NOT_FOUND)
    }

    if (password !== confirm_password) {
      return handleResponse(
        HttpStatusCode.BAD_REQUEST,
        false,
        USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD
      )
    }

    const hashedPassword = hashPassword(password)

    await db.User.update({ password: hashedPassword, forgot_password_token: null }, { where: { id: user.id } })

    return handleResponse(HttpStatusCode.SUCCESS, true, USERS_MESSAGES.RESET_PASSWORD_SUCCESS)
  }
  async getmetProfile({ id }: { id: string }) {
    const user = await db.User.findOne({
      where: { id },
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt', 'email_verify_token', 'forgot_password_token']
      },
      include: [
        {
          model: db.Follower,
          as: 'following',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: db.User,
              as: 'followed',
              attributes: ['id', 'username', 'name', 'email']
            }
          ]
        }
      ]
    })

    if (!user) {
      return handleResponse(HttpStatusCode.NOT_FOUND, false, USERS_MESSAGES.USER_NOT_FOUND)
    }

    const response = new UserRespone(user)
    return handleResponse(HttpStatusCode.SUCCESS, true, USERS_MESSAGES.GET_PROFILE_SUCCESS, response)
  }
  async updateProfile({ id, body }: { id: string; body: any }) {
    const user = await db.User.findByPk(id)

    if (!user) {
      return handleResponse(HttpStatusCode.NOT_FOUND, false, USERS_MESSAGES.USER_NOT_FOUND)
    }

    await user.update(body)

    const response = UserRespone.toResponse(user)

    return handleResponse(HttpStatusCode.SUCCESS, true, USERS_MESSAGES.UPDATE_ME_SUCCESS, response)
  }
  async getProfile({ username }: { username: string }) {
    const user = await db.User.findOne({
      where: { username },
      attributes: [
        'id',
        'name',
        'email',
        'bio',
        'location',
        'website',
        'avatar',
        'username',
        'cover_photo',
        'verify_status'
      ]
    })

    if (!user) {
      return handleResponse(HttpStatusCode.NOT_FOUND, false, USERS_MESSAGES.USER_NOT_FOUND)
    }

    const response = UserRespone.toResponse(user)

    return handleResponse(HttpStatusCode.SUCCESS, true, USERS_MESSAGES.GET_PROFILE_SUCCESS, response)
  }
  async follow({ user_id, followed_user_id }: { user_id: number; followed_user_id: number }) {
    if (Number(user_id) === Number(followed_user_id)) {
      return handleResponse(HttpStatusCode.BAD_REQUEST, false, USERS_MESSAGES.CANNOT_FOLLOW_YOURSELF)
    }

    // Validate if the followed user exists
    const isUserExist = await db.User.count({ where: { id: followed_user_id } })
    if (!isUserExist) {
      return handleResponse(HttpStatusCode.NOT_FOUND, false, USERS_MESSAGES.USER_NOT_FOUND)
    }

    // Check if the follow relationship already exists
    const isAlreadyFollowed = await db.Follower.count({ where: { user_id, followed_user_id } })
    if (isAlreadyFollowed) {
      return handleResponse(HttpStatusCode.BAD_REQUEST, false, USERS_MESSAGES.ALREADY_FOLLOWED)
    }

    // Create a new follow
    await db.Follower.create({ user_id, followed_user_id })

    return handleResponse(HttpStatusCode.SUCCESS, true, USERS_MESSAGES.FOLLOW_SUCCESS)
  }
  async unfollow({ user_id, followed_user_id }: { user_id: number; followed_user_id: number }) {
    if (Number(user_id) === Number(followed_user_id)) {
      return handleResponse(HttpStatusCode.BAD_REQUEST, false, 'Cannot unfollow yourself')
    }

    // Validate if the followed user exists
    const isUserExist = await db.User.count({ where: { id: followed_user_id } })
    if (!isUserExist) {
      return handleResponse(HttpStatusCode.NOT_FOUND, false, USERS_MESSAGES.USER_NOT_FOUND)
    }

    // Check if the follow relationship exists
    const isFollowed = await db.Follower.findOne({ where: { user_id, followed_user_id } })
    if (!isFollowed) {
      return handleResponse(HttpStatusCode.BAD_REQUEST, false, 'You are not following this user')
    }

    // Delete the follow relationship
    await db.Follower.destroy({ where: { user_id, followed_user_id } })

    return handleResponse(HttpStatusCode.SUCCESS, true, USERS_MESSAGES.UNFOLLOW_SUCCESS)
  }

  async changePassword({ id, body }: { id: string; body: any }) {
    const user = await db.User.findByPk(id)

    if (!user) {
      return handleResponse(HttpStatusCode.NOT_FOUND, false, USERS_MESSAGES.USER_NOT_FOUND)
    }

    await user.update({
      password: hashPassword(body.new_password)
    })

    return handleResponse(HttpStatusCode.SUCCESS, true, USERS_MESSAGES.CHANGE_PASSWORD_SUCCESS)
  }
}

export default new UserServices()
