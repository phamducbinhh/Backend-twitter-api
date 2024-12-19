import jwt from 'jsonwebtoken'
import { envConfig } from '~/constants/config'

const generateToken = (id: string | number, expiresIn?: string) => {
  return jwt.sign({ id }, envConfig.jwtSecretAccessToken as string, {
    expiresIn: expiresIn || (envConfig.accessTokenExpiresIn as string)
  })
}

export default generateToken
