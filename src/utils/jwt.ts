import jwt from 'jsonwebtoken'
import { envConfig } from '~/constants/config'

const generateToken = (id: string | number) => {
  return jwt.sign({ id }, envConfig.jwtSecretAccessToken as string, {
    expiresIn: envConfig.accessTokenExpiresIn as string
  })
}

export default generateToken
