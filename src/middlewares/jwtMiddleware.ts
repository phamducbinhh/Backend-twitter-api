import jwt from 'jsonwebtoken'
import { envConfig } from '~/constants/config'
import { HttpStatusCode } from '~/constants/HttpStatusCode'
import { USERS_MESSAGES } from '~/constants/messages'

export const verifyToken = async (req: any, res: any, next: any) => {
  const token = req.cookies?.token ? req.cookies?.token : req.headers?.authorization?.split(' ')[1]

  if (!token) {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({
      success: false,
      message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED
    })
  }
  try {
    jwt.verify(token, envConfig.jwtSecretAccessToken as string, (err: any, decoded: any) => {
      if (err) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({
          success: false,
          message: USERS_MESSAGES.ACCESS_TOKEN_IS_EXPIRED
        })
      }
      req.user = decoded
      next()
    })
  } catch (error: any) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      message: error.message
    })
  }
}
