<!-- user -->
npx sequelize-cli model:generate --name User --attributes name:string,email:string,date_of_birth:date,password:string,email_verify_token:string,forgot_password_token:string,bio:text,location:string,website:string,username:string,cover_photo:string,verify_status:enum('Unverified','Verified','Banned')

<!-- tweets -->
npx sequelize-cli model:generate --name Tweet --attributes user_id:integer,type:enum('Tweet','Retweet','QuoteTweet','Comment'),audience:enum('Everyone','TwitterCircle'),content:text,parent_id:integer,guest_views:integer,user_views:integer

<!-- hashtags -->
npx sequelize-cli model:generate --name Hashtag --attributes name:string

<!-- tweet_hashtags -->
npx sequelize-cli model:generate --name TweetHashtag --attributes tweet_id:integer,hashtag_id:integer

<!-- mentions -->
npx sequelize-cli model:generate --name Mention --attributes tweet_id:integer,user_id:integer

<!-- media -->
npx sequelize-cli model:generate --name Media --attributes url:string

<!-- tweet_media  -->
npx sequelize-cli model:generate --name TweetMedia --attributes tweet_id:integer,media_id:integer

<!-- followers  -->
npx sequelize-cli model:generate --name Follower --attributes user_id:integer,followed_user_id:integer

<!-- likes  -->
npx sequelize-cli model:generate --name Like --attributes user_id:integer,tweet_id:integer

<!-- bookmarks  -->
npx sequelize-cli model:generate --name Bookmark --attributes user_id:integer,tweet_id:integer

<!-- refresh_tokens  -->
npx sequelize-cli model:generate --name RefreshToken --attributes token:string,user_id:integer

<!-- migrate -->
npx sequelize-cli db:migrate







