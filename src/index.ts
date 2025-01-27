import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { createServer } from 'http'
import { envConfig } from './constants/config'
import { connectDatabase } from './dbs/init.db'
import { errorHandler } from './middlewares/errorHandler'
import initRoutes from './routes'
import staticRouter from './routes/static.routes'
import { initFolder } from './utils/files'
import initSocket from './utils/socket'

const app = express()

const httpServer = createServer(app)

const corsOptions = {
  origin: ['http://localhost:3000'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  preflightContinue: false,
  credentials: true,
  optionsSuccessStatus: 204
}

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
  // store: ... , // Use an external store for more precise rate limiting
})

// tạo folder uploads
initFolder()

app.use(limiter)

app.use(helmet())

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

app.use(express.urlencoded({ extended: true }))

initRoutes(app)

app.use(errorHandler)

app.use('/static', staticRouter)

initSocket(httpServer)

const startServer = async () => {
  try {
    await connectDatabase()

    httpServer.listen(envConfig.port, () => {
      console.log(`App server listening on port: ${envConfig.port}`)
    })
  } catch (err: any) {
    console.error('App server error:', err.stack)
  }
}

startServer()
