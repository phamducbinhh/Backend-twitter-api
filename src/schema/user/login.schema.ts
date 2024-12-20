import { checkSchema, validationResult } from 'express-validator'
import { USERS_MESSAGES } from '~/constants/messages'

export class LoginUserSchema {
  static validationRules() {
    return checkSchema({
      email: {
        trim: true,
        isEmail: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
        }
      },
      password: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
        },
        isLength: {
          options: {
            min: 6,
            max: 50
          },
          errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
        },
        isString: {
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
        },
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
          },
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
        }
      }
    })
  }

  static validate(req: any): { isValid: boolean; errors: any[] } {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return {
        isValid: false,
        errors: errors.array()
      }
    }
    return { isValid: true, errors: [] }
  }
}
