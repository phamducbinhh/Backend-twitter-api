import { HttpStatusCode } from '~/constants/HttpStatusCode'
import { USERS_MESSAGES } from '~/constants/messages'
import { handleResponse } from '~/utils/response'

class TweetService {
  createTweet({ id, body }: { id: string; body: any }) {
    return handleResponse(HttpStatusCode.SUCCESS, true, USERS_MESSAGES.UPDATE_ME_SUCCESS)
  }
}

export default new TweetService()
