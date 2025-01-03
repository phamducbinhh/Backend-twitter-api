import { Response } from 'express'
import likesService from '~/services/likes.service'
import { sendResponse } from '~/utils/response'

class LikesController {
  constructor() {}

  async likeTweetController(req: { user: { id: string }; body: any } | any, res: Response) {
    const response = await likesService.likeTweet({ id: req.user?.id, body: req.body })
    sendResponse(res, response.statusCode, {
      success: response.success,
      message: response.message
    })
  }

  async unlikeTweetController(req: { user: { id: string }; body: any } | any, res: Response) {
    const response = await likesService.unlikeTweet({ id: req.user?.id, body: req.body })
    sendResponse(res, response.statusCode, {
      success: response.success,
      message: response.message
    })
  }
}

const likesController = new LikesController()
export default likesController
