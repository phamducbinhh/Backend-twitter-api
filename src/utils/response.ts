import { Response } from 'express'

export const sendResponse = (
  res: Response,
  statusCode: number,
  { success, message, data }: { success: boolean; message: string; data?: any }
) => {
  const responseBody: { success: boolean; message: string; data?: any } = {
    success,
    message
  }

  if (data !== undefined && data !== null) {
    responseBody.data = data
  }

  return res.status(statusCode).json(responseBody)
}

export const handleResponse = (statusCode: number, success: boolean, message: string, data: any = null) => {
  return { statusCode, success, message, ...(data && { data }) }
}
