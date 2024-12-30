import { HttpStatusCode } from '~/constants/HttpStatusCode'
import { TWEETS_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import { TweetRequestBody } from '~/types/tweet.type'
import { handleResponse } from '~/utils/response'

const db = require('../models')

class TweetService {
  // Hàm xử lý Media
  private async handleMedia(medias: any[], tweetId: number, transaction: any) {
    for (const media of medias) {
      if (!media.url || !media.type) {
        throw new Error(TWEETS_MESSAGES.INVALID_TWEET_ID)
      }

      const newMedia = await db.Media.create({ url: media.url, type: media.type }, { transaction })

      await db.TweetMedia.create({ tweet_id: tweetId, media_id: newMedia.id }, { transaction })
    }
  }

  // Hàm xử lý Hashtags
  private async handleHashtags(hashtags: string[], tweetId: number, transaction: any) {
    for (const hashtag of hashtags) {
      const [newHashtag] = await db.Hashtag.findOrCreate({
        where: { name: hashtag },
        transaction
      })

      await db.TweetHashtag.create({ tweet_id: tweetId, hashtag_id: newHashtag.id }, { transaction })
    }
  }

  // Hàm xử lý Mentions
  private async handleMentions(mentions: string[], tweetId: number, transaction: any) {
    for (const mentionId of mentions) {
      const user = await db.User.findByPk(mentionId)
      if (!user) {
        throw new Error(USERS_MESSAGES.USER_NOT_FOUND)
      }

      await db.Mention.create({ tweet_id: tweetId, user_id: user.id }, { transaction })
    }
  }

  // Hàm chính để tạo Tweet
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
          user_id: id,
          guest_views: 0,
          user_views: 0
        },
        { transaction }
      )

      // 2. Xử lý Media
      if (medias && medias.length > 0) {
        await this.handleMedia(medias, tweet.id, transaction)
      }

      // 3. Xử lý Hashtags
      if (hashtags && hashtags.length > 0) {
        await this.handleHashtags(hashtags, tweet.id, transaction)
      }

      // 4. Xử lý Mentions
      if (mentions && mentions.length > 0) {
        await this.handleMentions(mentions, tweet.id, transaction)
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
