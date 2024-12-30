import authRouter from './auth.routes'
import mediaRouter from './media.routes'
import tweetRouter from './tweet.routes'
import userRouter from './users.routes'

const initRoutes = (app: any): void => {
  app.use('/api/v1/auth', authRouter)
  app.use('/api/v1/user', userRouter)
  app.use('/api/v1/media', mediaRouter)
  app.use('/api/v1/tweet', tweetRouter)
}

export default initRoutes
