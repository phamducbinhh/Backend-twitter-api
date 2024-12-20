import { checkSchema } from 'express-validator'
import { USERS_MESSAGES } from '~/constants/messages'

export class ForgotPasswordSchema {
  static validationRules() {
    return checkSchema({
      email: {
        trim: true,
        notEmpty: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
        },
        isEmail: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
        }
      }
    })
  }
}
