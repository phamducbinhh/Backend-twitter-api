import { Response } from 'express'

interface ResponseData {
  success: boolean
  message: string
  data?: any
}

/**
 * Utility function to send a standardized response.
 * @param res - Express response object
 * @param statusCode - HTTP status code to return
 * @param responseData - Object containing success, message, and data
 */
export const sendResponse = (res: Response, statusCode: number, responseData: ResponseData) => {
  const { success, message, data = null } = responseData
  return res.status(statusCode).json({
    success,
    message,
    data
  })
}
