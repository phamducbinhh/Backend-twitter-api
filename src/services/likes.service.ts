import { HttpStatusCode } from '~/constants/HttpStatusCode'
import { LIKE_MESSAGES, TWEETS_MESSAGES } from '~/constants/messages'
import { LikeTweetReqBody } from '~/types/like.type'
import { handleResponse } from '~/utils/response'
const db = require('../models')

class LikeService {
  async likeTweet({ id, body }: { id: string; body: LikeTweetReqBody }) {
    const { tweet_id } = body

    const tweet = await db.Tweet.findByPk(tweet_id)

    if (!tweet) {
      return handleResponse(HttpStatusCode.NOT_FOUND, false, TWEETS_MESSAGES.TWEET_NOT_FOUND)
    }

    const existingLike = await db.Like.findOne({
      where: { user_id: id, tweet_id }
    })

    if (existingLike) {
      return handleResponse(HttpStatusCode.BAD_REQUEST, false, LIKE_MESSAGES.ALREADY_LIKED)
    }

    await db.Like.create({ user_id: id, tweet_id })
    return handleResponse(HttpStatusCode.SUCCESS, true, LIKE_MESSAGES.LIKE_SUCCESSFULLY)
  }
  async unlikeTweet({ id, body }: { id: string; body: LikeTweetReqBody }) {
    const { tweet_id } = body

    const tweet = await db.Tweet.findByPk(tweet_id)

    if (!tweet) {
      return handleResponse(HttpStatusCode.NOT_FOUND, false, TWEETS_MESSAGES.TWEET_NOT_FOUND)
    }

    const existingLike = await db.Like.findOne({
      where: { user_id: id, tweet_id }
    })

    if (!existingLike) {
      return handleResponse(HttpStatusCode.BAD_REQUEST, false, LIKE_MESSAGES.NOT_LIKED)
    }

    await db.Like.destroy({
      where: { user_id: id, tweet_id }
    })
    return handleResponse(HttpStatusCode.SUCCESS, true, LIKE_MESSAGES.UNLIKE_SUCCESSFULLY)
  }
}

export default new LikeService()
