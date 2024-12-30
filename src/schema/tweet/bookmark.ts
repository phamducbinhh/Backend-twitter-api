import { checkSchema } from 'express-validator'
import { TWEETS_MESSAGES } from '~/constants/messages'

export class TweetBookmarkSchema {
  static validationRules() {
    return checkSchema({
      tweet_id: {
        isInt: {
          errorMessage: TWEETS_MESSAGES.INVALID_TWEET_ID
        },
        notEmpty: {
          errorMessage: TWEETS_MESSAGES.NOT_EMTY_TWEET_ID
        }
      }
    })
  }
}
