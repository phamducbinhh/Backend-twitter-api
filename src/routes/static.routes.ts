import { Router } from 'express'
import mediaController from '~/controllers/media.controllers'

const staticRouter = Router()

staticRouter.get('/image/:name', mediaController.serveImageController)
staticRouter.get('/video/:name', mediaController.serveVideoStreamController)

export default staticRouter
