import { HttpStatusCode } from '~/constants/HttpStatusCode'
import { USERS_MESSAGES } from '~/constants/messages'
import { handleResponse } from '~/utils/response'

class MediaService {
  async uploadMedia() {
    return handleResponse(HttpStatusCode.SUCCESS, true, USERS_MESSAGES.UPLOAD_SUCCESS)
  }
}

export default new MediaService()
