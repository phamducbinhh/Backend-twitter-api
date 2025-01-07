import { checkSchema } from 'express-validator'
import { USERS_MESSAGES } from '~/constants/messages'

export class ConversationSchema {
  static validationRules() {
    return checkSchema({
      receiver_id: {
        trim: true,
        isInt: {
          errorMessage: USERS_MESSAGES.INVALID_USER_ID
        }
      }
    })
  }
}
