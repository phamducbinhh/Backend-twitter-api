import { HttpStatusCode } from '~/constants/HttpStatusCode'
import { TWEETS_MESSAGES } from '~/constants/messages'
import { handleResponse } from '~/utils/response'

class TweetService {
  createTweet({ id, body }: { id: string; body: any }) {
    console.log(id, body)
    return handleResponse(HttpStatusCode.SUCCESS, true, TWEETS_MESSAGES.CREATE_TWEET_SUCCESS)
  }
}

export default new TweetService()
