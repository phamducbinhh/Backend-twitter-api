import { HttpStatusCode } from '~/constants/HttpStatusCode'
import { USERS_MESSAGES } from '~/constants/messages'
import { handleUploadSingleImages } from '~/utils/files'
import { handleResponse } from '~/utils/response'

class MediaService {
  async uploadImageMedia(req: any) {
    const data = await handleUploadSingleImages(req)

    return handleResponse(HttpStatusCode.SUCCESS, true, USERS_MESSAGES.UPLOAD_SUCCESS, data)
  }
}

export default new MediaService()
