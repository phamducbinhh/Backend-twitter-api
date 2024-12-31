CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    date_of_birth DATE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    email_verify_token VARCHAR(255),
    forgot_password_token VARCHAR(255),
    bio TEXT,
    location VARCHAR(255),
    website VARCHAR(255),
    username VARCHAR(50) UNIQUE,
    cover_photo VARCHAR(255),
    verify_status ENUM('Unverified', 'Verified', 'Banned') DEFAULT 'Unverified',
    CHECK (verify_status IN ('Unverified', 'Verified', 'Banned'))
);

CREATE TABLE tweets (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('Tweet', 'Retweet', 'Comment', 'QuoteTweet') NOT NULL,
    content TEXT,
    parent_id INT,
    guest_views INT DEFAULT 0,
    user_views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES tweets(id) ON DELETE SET NULL,
    CHECK (type IN ('Tweet', 'Retweet', 'Comment', 'QuoteTweet'))
);

CREATE TABLE hashtags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE followers (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    followed_user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (followed_user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (user_id, followed_user_id)
);

CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    tweet_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tweet_id) REFERENCES tweets(id) ON DELETE CASCADE,
    UNIQUE (user_id, tweet_id)
);

CREATE TABLE bookmarks (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    tweet_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tweet_id) REFERENCES tweets(id) ON DELETE CASCADE,
    UNIQUE (user_id, tweet_id)
);

CREATE TABLE media (
    id SERIAL PRIMARY KEY,
    type ENUM('Image', 'Video') NOT NULL,
    url VARCHAR(255) NOT NULL,
    CHECK (type IN ('Image', 'Video'))
);

CREATE TABLE tweet_media (
    id SERIAL PRIMARY KEY,
    tweet_id INT NOT NULL,
    media_id INT NOT NULL,
    FOREIGN KEY (tweet_id) REFERENCES tweets(id) ON DELETE CASCADE,
    FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE,
    UNIQUE (tweet_id, media_id)
);

CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE tweet_hashtags (
    id SERIAL PRIMARY KEY,
    tweet_id INT NOT NULL,
    hashtag_id INT NOT NULL,
    FOREIGN KEY (tweet_id) REFERENCES tweets(id) ON DELETE CASCADE,
    FOREIGN KEY (hashtag_id) REFERENCES hashtags(id) ON DELETE CASCADE,
    UNIQUE (tweet_id, hashtag_id)
);

CREATE TABLE mentions (
    id SERIAL PRIMARY KEY,
    tweet_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (tweet_id) REFERENCES tweets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(tweet_id, user_id)
);

ALTER TABLE users
ADD COLUMN avatar VARCHAR(255);

-- 1. Drop unique constraint (nếu có) trên cột tweet_id
ALTER TABLE mentions DROP INDEX tweet_id;

-- 2. Thêm lại index (nếu cần thiết) trên tweet_id (nhưng không có UNIQUE)
CREATE INDEX idx_tweet_id ON mentions (tweet_id);


DELETE FROM table_name;

ALTER TABLE table_name AUTO_INCREMENT = 1;