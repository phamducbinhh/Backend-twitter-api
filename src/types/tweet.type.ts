import { MediaType, TweetAudience, TweetType } from '~/constants/enums'
import { Media } from './media.type'

export interface TweetRequestBody {
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | string //  chỉ null khi tweet gốc, không thì là tweet_id cha dạng string
  hashtags: string[]
  mentions: string[] | any
  medias: Media[] | any
}

export type TweetHashtag = {
  id: number
  name: string
}

export type TweetMedia = {
  id: number
  url: string
  type: MediaType
}

export type Mention = {
  id: number
  username: string
  name: string
  email: string
}
export type Bookmark = {
  id: number
  username: string
  name: string
  email: string
}
