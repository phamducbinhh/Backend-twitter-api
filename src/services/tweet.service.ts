import { HttpStatusCode } from '~/constants/HttpStatusCode'
import { TWEETS_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import { TweetRequestBody } from '~/types/tweet.type'
import { handleResponse } from '~/utils/response'

const db = require('../models')

class TweetService {
  // Tạo tweet mới
  private async createTweetRecord(id: string, body: TweetRequestBody, transaction: any) {
    const { audience, content, parent_id, type } = body
    return await db.Tweet.create(
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
  }

  // Xử lý Media
  private async handleMedia(medias: any[], tweetId: number, transaction: any) {
    for (const media of medias) {
      if (!media.url || !media.type) {
        throw new Error(TWEETS_MESSAGES.INVALID_TWEET_ID)
      }

      const newMedia = await db.Media.create({ url: media.url, type: media.type }, { transaction })
      await db.TweetMedia.create({ tweet_id: tweetId, media_id: newMedia.id }, { transaction })
    }
  }

  // Xử lý Hashtags, chỉ xử lý những hashtag chưa tồn tại
  private async handleHashtags(hashtags: string[], tweetId: number, transaction: any) {
    const existingHashtags = await db.Hashtag.findAll({
      where: { name: hashtags },
      transaction
    })
    const existingHashtagsNames = existingHashtags.map((hashtag: any) => hashtag.name)
    const newHashtags = hashtags.filter((hashtag) => !existingHashtagsNames.includes(hashtag))

    for (const hashtag of newHashtags) {
      const [newHashtag] = await db.Hashtag.findOrCreate({
        where: { name: hashtag },
        transaction
      })
      await db.TweetHashtag.create({ tweet_id: tweetId, hashtag_id: newHashtag.id }, { transaction })
    }
  }

  // Xử lý Mentions, chỉ xử lý những mention chưa tồn tại
  private async handleMentions(mentions: string[], tweetId: number, transaction: any) {
    const existingMentions = await db.Mention.findAll({
      where: { user_id: mentions },
      transaction
    })
    const existingMentionIds = existingMentions.map((mention: any) => mention.user_id)
    const newMentions = mentions.filter((mentionId) => !existingMentionIds.includes(mentionId))

    for (const mentionId of newMentions) {
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
      // 1. Tạo tweet mới
      const tweet = await this.createTweetRecord(id, body, transaction)

      // 2. Xử lý Media nếu có
      if (body.medias && body.medias.length > 0) {
        await this.handleMedia(body.medias, tweet.id, transaction)
      }

      // 3. Xử lý Hashtags nếu có
      if (body.hashtags && body.hashtags.length > 0) {
        await this.handleHashtags(body.hashtags, tweet.id, transaction)
      }

      // 4. Xử lý Mentions nếu có
      if (body.mentions && body.mentions.length > 0) {
        await this.handleMentions(body.mentions, tweet.id, transaction)
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
