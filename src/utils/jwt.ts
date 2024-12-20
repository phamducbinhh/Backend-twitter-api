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
