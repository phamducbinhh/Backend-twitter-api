import { checkSchema } from 'express-validator'
import { TWEETS_MESSAGES } from '~/constants/messages'

export class TweetSchema {
  static validationRules() {
    return checkSchema({
      type: {
        isIn: {
          errorMessage: TWEETS_MESSAGES.INVALID_TYPE
        }
      }
    })
  }
}
