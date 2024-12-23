import { checkSchema } from 'express-validator'
import { USERS_MESSAGES } from '~/constants/messages'

export class ChangePasswordSchema {
  // Hàm chung để định nghĩa quy tắc cho trường mật khẩu
  static passwordRules(fieldName: string, errorMessages: any) {
    return {
      [fieldName]: {
        notEmpty: {
          errorMessage: errorMessages.REQUIRED
        },
        isString: {
          errorMessage: errorMessages.MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 6,
            max: 50
          },
          errorMessage: errorMessages.LENGTH_MUST_BE_FROM_6_TO_50
        },
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
          },
          errorMessage: errorMessages.MUST_BE_STRONG
        }
      }
    }
  }

  static validationRules() {
    return checkSchema({
      ...this.passwordRules('old_password', {
        REQUIRED: USERS_MESSAGES.PASSWORD_IS_REQUIRED,
        MUST_BE_A_STRING: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING,
        LENGTH_MUST_BE_FROM_6_TO_50: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50,
        MUST_BE_STRONG: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
      }),
      ...this.passwordRules('new_password', {
        REQUIRED: USERS_MESSAGES.PASSWORD_IS_REQUIRED,
        MUST_BE_A_STRING: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING,
        LENGTH_MUST_BE_FROM_6_TO_50: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50,
        MUST_BE_STRONG: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
      }),
      confirm_new_password: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 6,
            max: 50
          },
          errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
        },
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
          },
          errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRONG
        },
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.new_password) {
              throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
            }
            return true
          }
        }
      }
    })
  }
}
