import { checkSchema } from 'express-validator'
import { USERS_MESSAGES } from '~/constants/messages'

export class VerifyEmailSchema {
  static validationRules() {
    return checkSchema({
      email_verify_token: {
        trim: true,
        notEmpty: {
          errorMessage: USERS_MESSAGES.EMAIL_VERIFY_TOKEN_IS_REQUIRED
        }
      }
    })
  }
}
