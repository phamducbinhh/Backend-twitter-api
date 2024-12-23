import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { USERS_MESSAGES } from '~/constants/messages'
import authService from '~/services/auth.service'
import refreshTokenService from '~/services/refreshToken.service'
import { LoginReqBody, RefreshTokenReqBody, RegisterReqBody } from '~/types/users.type'
import { sendResponse } from '~/utils/response'

class AuthController {
  async login(req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) {
    const response = await authService.login({ body: req.body }, res)
    sendResponse(res, response.statusCode, {
      success: response.success,
      message: response.message,
      data: response.data
    })
  }

  async register(req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) {
    const response = await authService.register({ body: req.body }, res)
    sendResponse(res, response.statusCode, {
      success: response.success,
      message: response.message,
      data: response.data
    })
  }

  async refreshToken(req: Request<ParamsDictionary, any, RefreshTokenReqBody>, res: Response) {
    const response = await authService.refreshToken({ body: req.body }, res)
    sendResponse(res, response.statusCode, {
      success: response.success,
      message: response.message,
      data: response.data
    })
  }

  async logout(req: Request | (any & { user: { id: number } }), res: Response) {
    const { id } = req.user
    await refreshTokenService.deleteRefreshTokensByUserId(id)

    res.clearCookie('token')
    sendResponse(res, 200, {
      success: true,
      message: USERS_MESSAGES.LOGOUT_SUCCESS
    })
  }

  async loginGoogle(req: Request | (any & { user: { id: number } }), res: Response) {
    const response = await authService.loginGoogle({ accessToken: req.body.accessToken }, res)
    sendResponse(res, response.statusCode, {
      success: response.success,
      message: response.message,
      data: response.data
    })
  }
}

const authController = new AuthController()
export default authController
