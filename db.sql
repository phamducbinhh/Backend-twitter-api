CREATE TABLE User (
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
    verify_status ENUM('Unverified', 'Verified', 'Banned') DEFAULT 'Unverified'
);

CREATE TABLE Tweet (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('Tweet', 'Retweet', 'Comment', 'QuoteTweet') NOT NULL,
    content TEXT,
    parent_id INT,
    guest_views INT DEFAULT 0,
    user_views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(id)
);

CREATE TABLE Hashtag (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Follower (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    followed_user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(id),
    FOREIGN KEY (followed_user_id) REFERENCES User(id)
);

CREATE TABLE Like (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    tweet_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(id),
    FOREIGN KEY (tweet_id) REFERENCES Tweet(id)
);

CREATE TABLE Bookmark (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    tweet_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(id),
    FOREIGN KEY (tweet_id) REFERENCES Tweet(id)
);

CREATE TABLE Media (
    id SERIAL PRIMARY KEY,
    type ENUM('Image', 'Video') NOT NULL,
    url VARCHAR(255) NOT NULL
);

CREATE TABLE RefreshToken (
    id SERIAL PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(id)
);
