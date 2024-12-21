import jwt from 'jsonwebtoken'
import { envConfig } from '~/constants/config'
import { UserVerifyStatus } from '~/constants/enums'

export const generateAccessToken = ({
  id,
  verifyStatus
}: {
  id: string | number
  verifyStatus: UserVerifyStatus
  expiresIn?: string
}) => {
  return jwt.sign({ id, verify_status: verifyStatus }, envConfig.jwtSecretAccessToken as string, {
    expiresIn: envConfig.accessTokenExpiresIn as string
  })
}

export const generateRefreshToken = ({
  id,
  verifyStatus
}: {
  id: string | number
  verifyStatus: UserVerifyStatus
  expiresIn?: string
}) => {
  return jwt.sign({ id, verify_status: verifyStatus }, envConfig.jwtSecretRefreshToken as string, {
    expiresIn: envConfig.refreshTokenExpiresIn as string
  })
}

export const generateEmailVerifyToken = ({ id }: { id: string | number }) => {
  return jwt.sign({ id }, envConfig.jwtSecretEmailVerifyToken as string, {
    expiresIn: envConfig.emailVerifyTokenExpiresIn as string
  })
}

export const generateForgotPasswordToken = ({ id }: { id: string | number }) => {
  return jwt.sign({ id }, envConfig.jwtSecretForgotPasswordToken as string, {
    expiresIn: envConfig.forgotPasswordTokenExpiresIn as string
  })
}
