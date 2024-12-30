import { Response } from 'express'
import tweetService from '~/services/tweet.service'
import { sendResponse } from '~/utils/response'

class TweetController {
  constructor() {}

  async createTweet(req: { user: { id: string }; body: any } | any, res: Response) {
    const response = await tweetService.createTweet({ id: req.user?.id, body: req.body })
    sendResponse(res, response.statusCode, {
      success: response.success,
      message: response.message
    })
  }
}

const tweetController = new TweetController()
export default tweetController
