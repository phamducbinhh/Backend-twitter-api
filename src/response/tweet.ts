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

  private mapTweetMedia(tweetMedia: any[]): TweetMedia[] {
    return tweetMedia.map((media: any) => ({
      id: media.media.id,
      url: media.media.url,
      type: media.media.type
    }))
  }

  private mapTweetHashtags(tweetHashtags: any[]): TweetHashtag[] {
    return tweetHashtags.map((hashtag: any) => ({
      id: hashtag.hashtag.id,
      name: hashtag.hashtag.name
    }))
  }

  private mapMentions(mentions: any[]): Mention[] {
    return mentions.map((mention: any) => ({
      id: mention.user.id,
      username: mention.user.username,
      name: mention.user.name,
      email: mention.user.email
    }))
  }
}
