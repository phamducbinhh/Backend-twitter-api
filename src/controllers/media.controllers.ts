import { Response } from 'express'
import mediaService from '~/services/media.service'
import { sendResponse } from '~/utils/response'

class MediaController {
  async uploadImageMedia(req: any, res: Response) {
    const response = await mediaService.uploadImageMedia(req)
    sendResponse(res, response.statusCode, {
      success: response.success,
      message: response.message,
      data: response.data
    })
  }
  async uploadVideoMedia(req: any, res: Response) {
    const response = await mediaService.uploadVideoMedia(req)
    sendResponse(res, response.statusCode, {
      success: response.success,
      message: response.message,
      data: response.data
    })
  }
}

const mediaController = new MediaController()
export default mediaController
