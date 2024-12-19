import { NextFunction, Request, Response } from 'express'
import { ErrorResponse } from '~/utils/errorResponse'

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = { ...err }
  error.message = err.message

  // Log lỗi trong môi trường phát triển
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack)
  }

  // Xử lý lỗi không xác định
  if (!(err instanceof ErrorResponse)) {
    error = new ErrorResponse('Internal Server Error', 500, false)
  }

  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  })
}
