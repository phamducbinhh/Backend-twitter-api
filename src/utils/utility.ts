import { HttpStatusCode } from '~/constants/HttpStatusCode'

export const handleError = (res: any, error: any) => {
  return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: error.message
  })
}
