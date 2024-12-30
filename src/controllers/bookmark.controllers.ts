import { Response } from 'express'
import bookmarkService from '~/services/bookmark.service'
import { sendResponse } from '~/utils/response'

class BookmarkController {
  constructor() {}

  async createBookmark(req: { user: { id: string }; body: any } | any, res: Response) {
    const response = await bookmarkService.createBookmark({ id: req.user?.id, body: req.body })
    sendResponse(res, response.statusCode, {
      success: response.success,
      message: response.message
    })
  }
}

const bookmarkController = new BookmarkController()
export default bookmarkController
