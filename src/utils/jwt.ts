import jwt from 'jsonwebtoken'
import { envConfig } from '~/constants/config'

export const generateAccessToken = (id: string | number, expiresIn?: string) => {
  return jwt.sign({ id }, envConfig.jwtSecretAccessToken as string, {
    expiresIn: expiresIn || (envConfig.accessTokenExpiresIn as string)
  })
}
export const generateRefreshToken = (id: string | number, expiresIn?: string) => {
  return jwt.sign({ id }, envConfig.jwtSecretRefreshToken as string, {
    expiresIn: expiresIn || (envConfig.refreshTokenExpiresIn as string)
  })
}
export const generateEmailVerifyToken = (id: string | number, expiresIn?: string) => {
  return jwt.sign({ id }, envConfig.jwtSecretEmailVerifyToken as string, {
    expiresIn: expiresIn || (envConfig.emailVerifyTokenExpiresIn as string)
  })
}
export const generateForgotPasswordToken = (id: string | number, expiresIn?: string) => {
  return jwt.sign({ id }, envConfig.jwtSecretForgotPasswordToken as string, {
    expiresIn: expiresIn || (envConfig.forgotPasswordTokenExpiresIn as string)
  })
}
