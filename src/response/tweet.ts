import { Mention, TweetHashtag, TweetMedia } from '~/types/tweet.type'

export class TweetResponse {
  id: number
  user_id: number
  content: string
  parent_id: number | null
  guest_views: number
  user_views: number
  type: number
  audience: number
  tweet_media: TweetMedia[]
  tweet_hashtags: TweetHashtag[]
  mentions: Mention[]

  constructor(tweet: any) {
    this.id = tweet.id
    this.user_id = tweet.user_id
    this.content = tweet.content
    this.parent_id = tweet.parent_id
    this.guest_views = tweet.guest_views
    this.user_views = tweet.user_views
    this.type = tweet.type
    this.audience = tweet.audience
    this.tweet_media = this.mapTweetMedia(tweet.tweet_media)
    this.tweet_hashtags = this.mapTweetHashtags(tweet.tweet_hashtags)
    this.mentions = this.mapMentions(tweet.mentions)
  }

  private mapTweetMedia(tweetMedia: TweetMedia[]): TweetMedia[] {
    return tweetMedia.map((item: any) => ({
      id: item.media.id,
      url: item.media.url,
      type: item.media.type
    }))
  }

  private mapTweetHashtags(tweetHashtags: TweetHashtag[]): TweetHashtag[] {
    return tweetHashtags.map((item: any) => ({
      id: item.hashtag.id,
      name: item.hashtag.name
    }))
  }

  private mapMentions(mentions: Mention[]): Mention[] {
    return mentions.map((item: any) => ({
      id: item.user.id,
      username: item.user.username,
      name: item.user.name,
      email: item.user.email
    }))
  }
}
