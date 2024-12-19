import { NextFunction, Request, Response } from 'express'
import { HttpStatusCode } from '~/constants/HttpStatusCode'

/**
 * Global error handling middleware.
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR
  const message = err.message || 'Internal Server Error'

  res.status(statusCode).json({
    success: false,
    message
  })
}
