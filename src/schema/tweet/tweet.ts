import { checkSchema } from 'express-validator'
import { TweetAudience, TweetType } from '~/constants/enums'
import { TWEETS_MESSAGES } from '~/constants/messages'
import { numberEnumToArray } from '~/utils/commons'

export class TweetSchema {
  static validationRules() {
    return checkSchema({
      type: {
        isIn: {
          options: numberEnumToArray(TweetType),
          errorMessage: TWEETS_MESSAGES.INVALID_TYPE
        },
        optional: true
      },

      audience: {
        isIn: {
          options: numberEnumToArray(TweetAudience),
          errorMessage: TWEETS_MESSAGES.INVALID_AUDIENCE
        },
        optional: true
      },

      content: {
        isString: {
          errorMessage: TWEETS_MESSAGES.CONTENT_MUST_BE_A_NON_EMPTY_STRING
        },
        notEmpty: {
          errorMessage: TWEETS_MESSAGES.CONTENT_MUST_BE_A_NON_EMPTY_STRING
        }
      },

      media: {
        isArray: true,
        optional: true
      },

      hashtags: {
        isArray: true,
        optional: true,
        custom: {
          options: (value: any) => {
            if (value && !value.every((tag: string) => typeof tag === 'string')) {
              throw new Error(TWEETS_MESSAGES.HASHTAGS_MUST_BE_AN_ARRAY_OF_STRING)
            }
            return true
          }
        }
      },

      mentions: {
        isArray: true,
        optional: true,
        custom: {
          options: (value: any) => {
            if (value && !value.every((mentionId: number) => Number.isInteger(mentionId))) {
              throw new Error(TWEETS_MESSAGES.MENTIONS_MUST_BE_AN_ARRAY_OF_USER_ID)
            }
            return true
          }
        }
      }
    })
  }
}
