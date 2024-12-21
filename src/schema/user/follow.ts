import { checkSchema } from 'express-validator'
import { USERS_MESSAGES } from '~/constants/messages'

export class FollowSchema {
  static validationRules() {
    return checkSchema({
      followed_user_id: {
        trim: true,
        isInt: {
          errorMessage: USERS_MESSAGES.INVALID_USER_ID
        }
      }
    })
  }
}
