import { UserVerifyStatus } from '~/constants/enums'
import { HttpStatusCode } from '~/constants/HttpStatusCode'
import { USERS_MESSAGES } from '~/constants/messages'
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
        verify_status: 'Verified'
      },
      {
        where: { id }
      }
    )

    return handleResponse(HttpStatusCode.SUCCESS, true, USERS_MESSAGES.EMAIL_VERIFY_SUCCESS)
  }
  async resendVerifyEmail({ id }: { id: string }) {
    const emailVerifyToken = generateEmailVerifyToken(id)

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

    const forgotPasswordToken = generateForgotPasswordToken(user.id)

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
        exclude: ['password', 'createdAt', 'updatedAt']
      }
    })

    if (!user) {
      return handleResponse(HttpStatusCode.NOT_FOUND, false, USERS_MESSAGES.USER_NOT_FOUND)
    }

    return handleResponse(HttpStatusCode.SUCCESS, true, USERS_MESSAGES.GET_PROFILE_SUCCESS, user)
  }
}

export default new UserServices()
