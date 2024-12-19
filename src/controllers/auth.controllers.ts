import { HttpStatusCode } from '~/constants/HttpStatusCode'
import authService from '~/services/auth.service'
import { handleError } from '~/utils/utility'

class AuthController {
  constructor() {}

  async login(req: any, res: any) {
    try {
      const response = await authService.login({ body: req.body }, res)
      if (response.success === false) return res.status(HttpStatusCode.NOT_FOUND).json(response)

      return res.status(HttpStatusCode.SUCCESS).json(response)
    } catch (error: any) {
      return handleError(res, error)
    }
  }
  async register(req: any, res: any) {
    try {
      const response = await authService.register({ body: req.body }, res)
      if (response.success === false) return res.status(HttpStatusCode.NOT_FOUND).json(response)

      return res.status(HttpStatusCode.CREATED).json(response)
    } catch (error: any) {
      return handleError(res, error)
    }
  }
  async logout(req: any, res: any) {
    try {
      res.clearCookie('token')
      return res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Logout successfully'
      })
    } catch (error: any) {
      return handleError(res, error)
    }
  }
}

const authController = new AuthController()
export default authController
