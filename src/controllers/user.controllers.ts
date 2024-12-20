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

  async resetPassword(req: any, res: Response) {
    const response = await userService.resetPassword({ body: req.body })
    sendResponse(res, response.statusCode, {
      success: response.success,
      message: response.message
    })
  }

  async getmetProfile(req: { user: { id: string } } | any, res: Response) {
    const response = await userService.getmetProfile({ id: req.user?.id })
    sendResponse(res, response.statusCode, {
      success: response.success,
      message: response.message,
      data: response.data
    })
  }

  async updateProfile(req: { user: { id: string }; body: any } | any, res: Response) {
    const response = await userService.updateProfile({ id: req.user?.id, body: req.body })
    sendResponse(res, response.statusCode, {
      success: response.success,
      message: response.message,
      data: response.data
    })
  }

  async getProfile(req: any, res: Response) {
    const response = await userService.getProfile({ username: req.params.username })
    sendResponse(res, response.statusCode, {
      success: response.success,
      message: response.message,
      data: response.data
    })
  }

  async follow(req: any, res: Response) {
    const user_id = req.user?.id
    const followed_user_id = req.body.followed_user_id
    const response = await userService.follow({ user_id, followed_user_id })
    sendResponse(res, response.statusCode, {
      success: response.success,
      message: response.message
    })
  }

  async unfollow(req: any, res: Response) {
    const user_id = req.user?.id
    const followed_user_id = req.body.followed_user_id
    const response = await userService.unfollow({ user_id, followed_user_id })
    sendResponse(res, response.statusCode, {
      success: response.success,
      message: response.message
    })
  }
}

const userController = new UserController()
export default userController
