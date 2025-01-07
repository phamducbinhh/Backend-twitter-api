import { Response } from 'express'
import conversationService from '~/services/conversations.service'
import { sendResponse } from '~/utils/response'

class ConversationsController {
  constructor() {}

  async getConversations(req: { user: { id: string } } | any, res: Response) {
    const limit = Number(req.query.limit) || 100
    const page = Number(req.query.page) || 1
    const { receiver_id } = req.params
    const sender_id = req.user?.id
    const response = await conversationService.getConversations({ limit, page, receiver_id, sender_id })

    sendResponse(res, response.statusCode, {
      success: response.success,
      message: response.message,
      data: response.data
    })
  }

  async getReceivers(req: { user: { id: string } } | any, res: Response) {
    const sender_id = req.user?.id
    const response = await conversationService.getReceivers({ sender_id })
    sendResponse(res, response.statusCode, {
      success: response.success,
      message: response.message,
      data: response.data
    })
  }
}

const conversationsController = new ConversationsController()
export default conversationsController
