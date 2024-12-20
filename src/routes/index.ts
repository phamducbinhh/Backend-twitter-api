import authRouter from './auth.routes'
import userRouter from './users.routes'

const initRoutes = (app: any): void => {
  app.use('/api/v1/auth', authRouter)
  app.use('/api/v1/user', userRouter)
}

export default initRoutes
