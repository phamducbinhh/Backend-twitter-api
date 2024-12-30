import { checkSchema } from 'express-validator'
import { TweetAudience, TweetType } from '~/constants/enums'
import { TWEETS_MESSAGES } from '~/constants/messages'
import { numberEnumToArray } from '~/utils/commons'

export class TweetSchema {
  static validationRules() {
    return checkSchema({
      type: {
        isIn: {
          options: [numberEnumToArray(TweetType)],
          errorMessage: TWEETS_MESSAGES.INVALID_TYPE
        },
        optional: true
      },

      audience: {
        isIn: {
          options: [numberEnumToArray(TweetAudience)], // Sử dụng Enum để xác định giá trị hợp lệ
          errorMessage: TWEETS_MESSAGES.INVALID_AUDIENCE
        },
        optional: true // Không bắt buộc
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
        optional: true,
        custom: {
          options: (value: any) => {
            if (
              value &&
              !value.every(
                (media: { url: string; type: number }) =>
                  typeof media.url === 'string' &&
                  media.url.trim() !== '' &&
                  Number.isInteger(media.type) &&
                  [0, 1].includes(media.type) // 0: image, 1: video
              )
            ) {
              throw new Error(TWEETS_MESSAGES.MEDIAS_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT)
            }
            return true
          }
        }
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
            if (value && !value.every((mention: { user_id: number }) => Number.isInteger(mention.user_id))) {
              throw new Error(TWEETS_MESSAGES.MENTIONS_MUST_BE_AN_ARRAY_OF_USER_ID)
            }
            return true
          }
        }
      }
    })
  }
}
