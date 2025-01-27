import { NextFunction, Request } from 'express'
import jwt from 'jsonwebtoken'
import { envConfig } from '~/constants/config'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
import { HttpStatusCode } from '~/constants/HttpStatusCode'
import { USERS_MESSAGES } from '~/constants/messages'
import { TokenPayload } from '~/types/users.type'

export const verifyToken = (tokenType: TokenType) => (req: any, res: any, next: any) => {
  const tokenMap = {
    [TokenType.AccessToken]: {
      token: req.cookies?.token || req.headers?.authorization?.split(' ')[1],
      secret: envConfig.jwtSecretAccessToken
    },
    [TokenType.RefreshToken]: { token: req.body.refresh_token, secret: envConfig.jwtSecretRefreshToken },
    [TokenType.EmailVerifyToken]: { token: req.body.email_verify_token, secret: envConfig.jwtSecretEmailVerifyToken },
    [TokenType.ForgotPasswordToken]: {
      token: req.body.forgot_password_token,
      secret: envConfig.jwtSecretForgotPasswordToken
    }
  }

  const { token, secret } = tokenMap[tokenType]

  if (!token) {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({
      success: false,
      message: `${tokenType} token is required`
    })
  }

  // Xác minh token
  try {
    jwt.verify(token, secret as string, (err: any, decoded: any) => {
      if (err) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({
          success: false,
          message: USERS_MESSAGES.TOKEN_IS_EXPIRED
        })
      }
      req.user = decoded // Gắn dữ liệu user vào req
      next()
    })
  } catch (error: any) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      success: false,
      message: error.message
    })
  }
}

export const verifiedUserValidator = (req: any, res: any, next: any) => {
  const { verify_status } = req.user as TokenPayload
  if (verify_status !== UserVerifyStatus.Verified) {
    return res.status(HttpStatusCode.FORBIDEN).json({
      success: false,
      message: USERS_MESSAGES.USER_NOT_VERIFIED
    })
  }
  next()
}

export const isUserLoggedInValidator = (middleware: (req: Request, res: any, next: NextFunction) => void) => {
  return (req: Request, res: any, next: NextFunction) => {
    const authorization = req.cookies?.token || req.headers?.authorization?.split(' ')[1]
    if (authorization) {
      return middleware(req, res, next)
    }
    next()
  }
}
