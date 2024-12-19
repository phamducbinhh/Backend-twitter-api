import { Request, Response } from 'express'
import authService from '~/services/auth.service'
import asyncHandler from '~/middlewares/asyncHandler'
import { sendResponse } from '~/utils/response'

class AuthController {
  login = asyncHandler(async (req: Request, res: Response) => {
    const response = await authService.login({ body: req.body }, res)
    return sendResponse(res, response.statusCode, {
      success: response.success,
      message: response.message,
      data: response.data
    })
  })

  register = asyncHandler(async (req: Request, res: Response) => {
    const response = await authService.register({ body: req.body }, res)
    return sendResponse(res, response.statusCode, {
      success: response.success,
      message: response.message,
      data: response.data
    })
  })

  logout = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie('token')
    return sendResponse(res, 200, {
      success: true,
      message: 'Logout successfully'
    })
  })
}

const authController = new AuthController()
export default authController
