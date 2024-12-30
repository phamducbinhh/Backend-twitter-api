import { HttpStatusCode } from '~/constants/HttpStatusCode'
import { BOOKMARK_MESSAGES, TWEETS_MESSAGES } from '~/constants/messages'
import { BookmarkTweetReqBody } from '~/types/bookmark.type'
import { handleResponse } from '~/utils/response'
const db = require('../models')

class BookmarkService {
  async createBookmark({ id, body }: { id: string; body: BookmarkTweetReqBody }) {
    // Create a new follow
    const { tweet_id } = body

    // Kiểm tra xem tweet_id có tồn tại trong bảng Tweet không
    const tweet = await db.Tweet.findByPk(tweet_id)

    if (!tweet) {
      return handleResponse(HttpStatusCode.NOT_FOUND, false, TWEETS_MESSAGES.TWEET_NOT_FOUND)
    }

    // Kiểm tra xem người dùng đã bookmark tweet này chưa
    const existingBookmark = await db.Bookmark.findOne({
      where: { user_id: id, tweet_id }
    })

    // Nếu tweet tồn tại, tạo bookmark
    if (existingBookmark) {
      return handleResponse(HttpStatusCode.BAD_REQUEST, false, BOOKMARK_MESSAGES.ALREADY_BOOKMARKED)
    }

    await db.Bookmark.create({ user_id: id, tweet_id })
    return handleResponse(HttpStatusCode.SUCCESS, true, BOOKMARK_MESSAGES.BOOKMARK_SUCCESSFULLY)
  }
}

export default new BookmarkService()
