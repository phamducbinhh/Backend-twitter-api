import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import { connectDatabase } from './dbs/init.db'
import { errorHandler } from './middlewares/errorHandler'
import initRoutes from './routes'
import { initFolder } from './utils/files'
import { envConfig } from './constants/config'
const app = express()

const corsOptions = {
  origin: ['https://local.oeg.vn'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  preflightContinue: false,
  credentials: true,
  optionsSuccessStatus: 204
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
  // store: ... , // Use an external store for more precise rate limiting
})

// tạo folder uploads
initFolder()

app.use(limiter)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

app.use(express.urlencoded({ extended: true }))

initRoutes(app)

app.use(errorHandler)

const startServer = async () => {
  try {
    await connectDatabase()

    app.listen(envConfig.port, () => {
      console.log(`App server listening on port: ${envConfig.port}`)
    })
  } catch (err: any) {
    console.error('App server error:', err.stack)
  }
}

startServer()
