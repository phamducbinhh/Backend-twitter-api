import { Response } from 'express'
import userService from '~/services/user.service'
import { VerifyEmailReqBody } from '~/types/users.type'
import { sendResponse } from '~/utils/response'

class UserController {
  async verifyEmail(req: { user: { id: string }; body: VerifyEmailReqBody } | any, res: Response) {
    const response = await userService.verifyEmail({ body: req.body, id: req.user?.id })
    sendResponse(res, response.statusCode, {
      success: response.success,
      message: response.message
    })
  }

  async resendVerifyEmail(req: { user: { id: string } } | any, res: Response) {
    const response = await userService.resendVerifyEmail({ id: req.user?.id })
    sendResponse(res, response.statusCode, {
      success: response.success,
      message: response.message
    })
  }

  async forgotPassword(req: any, res: Response) {
    const response = await userService.forgotPassword({ body: req.body })
    sendResponse(res, response.statusCode, {
      success: response.success,
      message: response.message
    })
  }
}

const userController = new UserController()
export default userController
