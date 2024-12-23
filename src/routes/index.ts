import authRouter from './auth.routes'
import userRouter from './users.routes'
import mediaRouter from './media.routes'

const initRoutes = (app: any): void => {
  app.use('/api/v1/auth', authRouter)
  app.use('/api/v1/user', userRouter)
  app.use('/api/v1/media', mediaRouter)
}

export default initRoutes
