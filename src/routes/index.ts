import authRouter from './auth.routes'
import bookmarkRouter from './bookmarks.routes'
import likesRouter from './likes.routes'
import mediaRouter from './media.routes'
import tweetRouter from './tweet.routes'
import userRouter from './users.routes'
import searchRouter from './search.routes'
const initRoutes = (app: any): void => {
  app.use('/api/v1/auth', authRouter)
  app.use('/api/v1/user', userRouter)
  app.use('/api/v1/media', mediaRouter)
  app.use('/api/v1/tweet', tweetRouter)
  app.use('/api/v1/bookmark', bookmarkRouter)
  app.use('/api/v1/likes', likesRouter)
  app.use('/api/v1/search', searchRouter)
}

export default initRoutes
