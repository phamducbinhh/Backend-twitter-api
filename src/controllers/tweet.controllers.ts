import { Response } from 'express'
import tweetService from '~/services/tweet.service'
import { sendResponse } from '~/utils/response'

class TweetController {
  constructor() {}

  async createTweet(req: { user: { id: string }; body: any } | any, res: Response) {
    const response = await tweetService.createTweet({ id: req.user?.id, body: req.body })
    sendResponse(res, response.statusCode, {
      success: response.success,
      message: response.message,
      data: response.data
    })
  }

  async getTweetDetail(req: any, res: Response) {
    const response = await tweetService.getTweetDetail({ id: req.params.id, user_id: req.user?.id })
    sendResponse(res, response.statusCode, {
      success: response.success,
      message: response.message,
      data: response.data
    })
  }
  async getTweetChildren(req: any, res: Response) {
    const page = parseInt(req.query.page || 1)
    const limit = parseInt(req.query.limit || 10)
    const response = await tweetService.getTweetChildren({
      parent_id: req.params.tweet_id,
      page,
      limit
    })
    sendResponse(res, response.statusCode, {
      success: response.success,
      message: response.message,
      data: response.data
    })
  }
}

const tweetController = new TweetController()
export default tweetController
