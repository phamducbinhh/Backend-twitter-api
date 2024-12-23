import { Response } from 'express'
import mediaService from '~/services/media.service'
import { sendResponse } from '~/utils/response'

class MediaController {
  async uploadMedia(req: any, res: Response) {
    const response = await mediaService.uploadMedia()
    sendResponse(res, response.statusCode, {
      success: response.success,
      message: response.message
    })
  }
}

const mediaController = new MediaController()
export default mediaController
