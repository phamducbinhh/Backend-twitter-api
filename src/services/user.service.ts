import { UserVerifyStatus } from '~/constants/enums'
import { HttpStatusCode } from '~/constants/HttpStatusCode'
import { USERS_MESSAGES } from '~/constants/messages'
import { ForgotPasswordReqBody, VerifyEmailReqBody } from '~/types/users.type'
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
}

export default new UserServices()
