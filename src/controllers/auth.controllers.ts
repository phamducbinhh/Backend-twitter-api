import { Request, Response } from 'express'
import { USERS_MESSAGES } from '~/constants/messages'
import authService from '~/services/auth.service'
import { sendResponse } from '~/utils/response'

class AuthController {
  async login(req: Request, res: Response) {
    const response = await authService.login({ body: req.body }, res)
    sendResponse(res, response.statusCode, {
      success: response.success,
      message: response.message,
      data: response.data
    })
  }

  async register(req: Request, res: Response) {
    const response = await authService.register({ body: req.body }, res)
    sendResponse(res, response.statusCode, {
      success: response.success,
      message: response.message,
      data: response.data
    })
  }

  async logout(req: Request, res: Response) {
    res.clearCookie('token')
    sendResponse(res, 200, {
      success: true,
      message: USERS_MESSAGES.LOGOUT_SUCCESS
    })
  }
}

const authController = new AuthController()
export default authController
