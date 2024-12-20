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
}

const userController = new UserController()
export default userController
