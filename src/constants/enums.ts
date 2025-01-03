export enum UserVerifyStatus {
  Unverified, // chưa xác thực email, mặc định = 0
  Verified, // đã xác thực email
  Banned // bị khóa
}

export enum TokenType {
  AccessToken = 'access',
  RefreshToken = 'refresh',
  ForgotPasswordToken = 'forgot_password',
  EmailVerifyToken = 'email_verify'
}

export enum MediaType {
  Image,
  Video,
  HLS
}

export enum MediaTypeQuery {
  Image = 'image',
  Video = 'video'
}

export enum ViewType {
  USER_VIEWS = 'user_views',
  GUEST_VIEWS = 'guest_views'
}

export enum EncodingStatus {
  Pending, // Đang chờ ở hàng đợi (chưa được encode)
  Processing, // Đang encode
  Success, // Encode thành công
  Failed // Encode thất bại
}

export enum TweetType {
  Tweet, // 0
  Retweet, // 1
  Comment, // 2
  QuoteTweet // 3
}

export enum TweetAudience {
  Everyone, // 0
  TwitterCircle // 1
}

export enum PeopleFollow {
  Anyone = '0',
  Following = '1'
}
