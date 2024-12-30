import { HttpStatusCode } from '~/constants/HttpStatusCode'
import { TWEETS_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import { TweetRequestBody } from '~/types/tweet.type'
import { handleResponse } from '~/utils/response'

const db = require('../models')

class TweetService {
  async createTweet({ id, body }: { id: string; body: TweetRequestBody }) {
    const transaction = await db.sequelize.transaction()
    try {
      const { audience, content, medias, parent_id, type, hashtags, mentions } = body
      // 1. Tạo tweet mới
      const tweet = await db.Tweet.create(
        {
          audience,
          content,
          parent_id: parent_id || null,
          type,
          user_id: id
        },
        { transaction }
      )

      // Bước 2: Xử lý Media
      if (medias && medias.length > 0) {
        for (const media of medias) {
          if (!media.url || !media.type) {
            return handleResponse(HttpStatusCode.BAD_REQUEST, false, TWEETS_MESSAGES.INVALID_TWEET_ID)
          }

          const newMedia = await db.Media.create(
            {
              url: media.url,
              type: media.type
            },
            { transaction }
          )

          await db.TweetMedia.create(
            {
              tweet_id: tweet.id,
              media_id: newMedia.id
            },
            { transaction }
          )
        }
      }

      // Bước 3: Xử lý Hashtags
      if (hashtags && hashtags.length > 0) {
        for (const hashtag of hashtags) {
          const [newHashtag] = await db.Hashtag.findOrCreate({
            where: { name: hashtag },
            transaction
          })

          await db.TweetHashtag.create(
            {
              tweet_id: tweet.id,
              hashtag_id: newHashtag.id
            },
            { transaction }
          )
        }
      }

      // Bước 4: Xử lý Mentions
      if (mentions && mentions.length > 0) {
        for (const mentionId of mentions) {
          const user = await db.User.findByPk(mentionId) // Lấy thông tin người dùng bị mention
          if (!user) {
            return handleResponse(HttpStatusCode.NOT_FOUND, false, USERS_MESSAGES.USER_NOT_FOUND)
          }

          await db.Mention.create(
            {
              tweet_id: tweet.id,
              user_id: user.id
            },
            { transaction }
          )
        }
      }
      // Commit transaction nếu tất cả thành công
      await transaction.commit()

      return handleResponse(HttpStatusCode.SUCCESS, true, TWEETS_MESSAGES.CREATE_TWEET_SUCCESS, tweet)
    } catch (error) {
      await transaction.rollback()
      console.error('Error creating tweet:', error)
      return handleResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, false, TWEETS_MESSAGES.CREATE_TWEET_FAILED)
    }
  }
}

export default new TweetService()
