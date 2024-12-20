import { envConfig } from '~/constants/config'
import { HttpStatusCode } from '~/constants/HttpStatusCode'
import { USERS_MESSAGES } from '~/constants/messages'
import { LoginReqBody, RefreshTokenReqBody, RegisterReqBody } from '~/types/users.type'
import { comparePassword, hashPassword } from '~/utils/bcrypt'
import { setTokenCookie } from '~/utils/cookies'
import { handleResponse } from '~/utils/response'
import refreshTokenService from './refreshToken.service'
import { generateAccessToken, generateRefreshToken } from '~/utils/jwt'
const db = require('../models')

class AuthServices {
  async login({ body }: { body: LoginReqBody }, res: any) {
    const { email, password } = body

    if (!email) {
      return handleResponse(HttpStatusCode.BAD_REQUEST, false, USERS_MESSAGES.EMAIL_IS_REQUIRED)
    }

    const user = await db.User.findOne({ where: { email } })

    if (!user) {
      return handleResponse(HttpStatusCode.NOT_FOUND, false, USERS_MESSAGES.EMAIL_INCORRECT)
    }

    if (!comparePassword(password, user.password)) {
      return handleResponse(HttpStatusCode.UNAUTHORIZED, false, USERS_MESSAGES.PASSWORD_IS_INCORRECT)
    }

    const token = generateAccessToken(user.id)
    setTokenCookie(res, token)

    const refreshToken = generateRefreshToken(user.id, envConfig.refreshTokenExpiresIn as string)
    await refreshTokenService.createRefreshToken(user.id, refreshToken)

    return handleResponse(HttpStatusCode.SUCCESS, true, USERS_MESSAGES.LOGIN_SUCCESS, { token, refreshToken })
  }

  async register({ body }: { body: RegisterReqBody }, res: any) {
    const { email, password, confirm_password, name, date_of_birth } = body

    const userExists = await db.User.findOne({
      where: { [db.Sequelize.Op.or]: [{ email }] }
    })

    if (userExists) {
      return handleResponse(HttpStatusCode.CONFLICT, false, USERS_MESSAGES.EMAIL_ALREADY_EXISTS)
    }

    if (password !== confirm_password) {
      return handleResponse(
        HttpStatusCode.BAD_REQUEST,
        false,
        USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD
      )
    }
    const hashedPassword = hashPassword(password)
    const user = await db.User.create({
      email,
      name,
      username: name.toLowerCase().replace(/\s+/g, ''),
      date_of_birth,
      password: hashedPassword,
      confirm_password: hashedPassword
    })

    const token = generateAccessToken(user.id)
    setTokenCookie(res, token)

    const refreshToken = generateRefreshToken(user.id, envConfig.refreshTokenExpiresIn as string)
    await refreshTokenService.createRefreshToken(user.id, refreshToken)

    return handleResponse(HttpStatusCode.CREATED, true, USERS_MESSAGES.REGISTER_SUCCESS, { token, refreshToken })
  }

  async refreshToken({ body }: { body: RefreshTokenReqBody }, res: any) {
    const { refresh_token } = body

    const storedToken = await db.RefreshToken.findOne({ where: { token: refresh_token } })
    if (!storedToken) {
      return handleResponse(HttpStatusCode.BAD_REQUEST, false, USERS_MESSAGES.REFRESH_TOKEN_IS_INVALID)
    }

    const user = await db.User.findOne({ where: { id: storedToken.user_id } })
    if (!user) {
      return handleResponse(HttpStatusCode.NOT_FOUND, false, USERS_MESSAGES.USER_NOT_FOUND)
    }

    const token = generateAccessToken(user.id)
    setTokenCookie(res, token)

    return handleResponse(HttpStatusCode.SUCCESS, true, USERS_MESSAGES.TOKEN_REFRESHED, { token })
  }
}

export default new AuthServices()
