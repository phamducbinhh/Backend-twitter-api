import { HttpStatusCode } from '~/constants/HttpStatusCode'
import { USERS_MESSAGES } from '~/constants/messages'
import authService from '~/services/auth.service'
import { handleError } from '~/utils/utility'

class AuthController {
  constructor() {}

  async login(req: any, res: any) {
    try {
      const response = await authService.login({ body: req.body }, res)
      return res.status(response.statusCode).json({
        success: response.success,
        message: response.message,
        data: response.data
      })
    } catch (error: any) {
      return handleError(res, error)
    }
  }
  async register(req: any, res: any) {
    try {
      const response = await authService.register({ body: req.body }, res)
      return res.status(response.statusCode).json({
        success: response.success,
        message: response.message,
        data: response.data
      })
    } catch (error: any) {
      return handleError(res, error)
    }
  }
  async logout(req: any, res: any) {
    try {
      res.clearCookie('token')
      return res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: USERS_MESSAGES.LOGOUT_SUCCESS
      })
    } catch (error: any) {
      return handleError(res, error)
    }
  }
}

const authController = new AuthController()
export default authController
