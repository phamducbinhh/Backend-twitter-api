import authRouter from './auth.routes'

const initRoutes = (app: any): void => {
  app.use('/api/v1/auth', authRouter)
}

export default initRoutes
