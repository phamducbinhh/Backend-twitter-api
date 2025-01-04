import { checkSchema } from 'express-validator'
import { PeopleFollow } from '~/constants/enums'

export class SearchSchema {
  static validationRules() {
    return checkSchema({
      q: {
        isString: {
          errorMessage: 'Query (q) must be a string'
        },
        trim: true,
        notEmpty: {
          errorMessage: 'Query (q) is required'
        }
      },
      type: {
        isString: {
          errorMessage: 'Type must be a string'
        },
        notEmpty: {
          errorMessage: 'Type is required'
        },
        isIn: {
          options: [['tweet', 'user', 'hashtag', 'media']],
          errorMessage: 'Type must be one of: tweet, user, hashtag, media'
        }
      },
      people_follow: {
        optional: true,
        isIn: {
          options: [Object.values(PeopleFollow)],
          errorMessage: 'People follow must be 0 or 1'
        }
      },
      page: {
        optional: true,
        isInt: {
          options: { min: 1 },
          errorMessage: 'Page must be a positive integer'
        },
        toInt: true
      },
      limit: {
        optional: true,
        isInt: {
          options: { min: 1, max: 100 },
          errorMessage: 'Limit must be a positive integer between 1 and 100'
        },
        toInt: true
      }
    })
  }
}
