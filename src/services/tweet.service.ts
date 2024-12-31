import { TweetType, ViewType } from '~/constants/enums'
import { HttpStatusCode } from '~/constants/HttpStatusCode'
import { TWEETS_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import { TweetResponse } from '~/response/tweet'
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
  private async handleMentions(mentions: number[], tweetId: number, transaction: any) {
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

  // Phương thức private để tăng view
  private async incrementTweetViews(tweetId: string, field: ViewType.USER_VIEWS | ViewType.GUEST_VIEWS) {
    await db.Tweet.increment(field, {
      by: 1,
      where: { id: tweetId }
    })
  }

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

  async getTweetDetail({ id, user_id }: { id: string; user_id: string | null }) {
    // Tăng view dựa trên user_id
    const fieldToIncrement = user_id ? ViewType.USER_VIEWS : ViewType.GUEST_VIEWS
    await this.incrementTweetViews(id, fieldToIncrement)
    // Tìm tweet theo ID

    const tweet = await db.Tweet.findByPk(id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: db.TweetMedia,
          as: 'tweet_media',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: db.Media,
              as: 'media',
              attributes: ['id', 'url', 'type']
            }
          ]
        },
        {
          model: db.TweetHashtag,
          as: 'tweet_hashtags',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: db.Hashtag,
              as: 'hashtag',
              attributes: ['id', 'name']
            }
          ]
        },
        {
          model: db.Mention,
          as: 'mentions',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: db.User,
              as: 'user',
              attributes: ['id', 'username', 'name', 'email']
            }
          ]
        },
        {
          model: db.Bookmark,
          as: 'bookmarks',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: db.User,
              as: 'user',
              attributes: ['id', 'username', 'name', 'email']
            }
          ]
        }
      ]
    })

    if (!tweet) {
      return handleResponse(HttpStatusCode.NOT_FOUND, false, TWEETS_MESSAGES.TWEET_NOT_FOUND)
    }

    const response = new TweetResponse(tweet)

    return handleResponse(HttpStatusCode.SUCCESS, true, TWEETS_MESSAGES.GET_TWEETS_SUCCESS, response)
  }

  async getTweetChildren({
    parent_id,
    page,
    limit,
    tweet_type = 0
  }: {
    parent_id: string
    page: number
    limit: number
    tweet_type: TweetType
  }) {
    const offset = (page - 1) * limit
    const { count, rows: tweets } = await db.Tweet.findAndCountAll({
      where: {
        parent_id,
        type: tweet_type
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: db.TweetMedia,
          as: 'tweet_media',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: db.Media,
              as: 'media',
              attributes: ['id', 'url', 'type']
            }
          ]
        },
        {
          model: db.TweetHashtag,
          as: 'tweet_hashtags',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: db.Hashtag,
              as: 'hashtag',
              attributes: ['id', 'name']
            }
          ]
        },
        {
          model: db.Mention,
          as: 'mentions',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: db.User,
              as: 'user',
              attributes: ['id', 'username', 'name', 'email']
            }
          ]
        },
        {
          model: db.Bookmark,
          as: 'bookmarks',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: db.User,
              as: 'user',
              attributes: ['id', 'username', 'name', 'email']
            }
          ]
        }
      ],
      limit,
      offset
    })

    if (!tweets) {
      return handleResponse(HttpStatusCode.NOT_FOUND, false, TWEETS_MESSAGES.TWEET_NOT_FOUND)
    }

    const response = {
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalItems: count,
      items: tweets.map((tweet: any) => new TweetResponse(tweet))
    }

    return handleResponse(HttpStatusCode.SUCCESS, true, TWEETS_MESSAGES.GET_TWEETS_SUCCESS, response)
  }
}

export default new TweetService()
