import axios from 'axios'
import { HttpStatusCode } from '~/constants/HttpStatusCode'
import { USERS_MESSAGES } from '~/constants/messages'
import { LoginReqBody, RefreshTokenReqBody, RegisterReqBody } from '~/types/users.type'
import { comparePassword, hashPassword } from '~/utils/bcrypt'
import { setTokenCookie } from '~/utils/cookies'
import { generateAccessToken, generateEmailVerifyToken, generateRefreshToken } from '~/utils/jwt'
import { handleResponse } from '~/utils/response'
import refreshTokenService from './refreshToken.service'
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

    const token = generateAccessToken({
      id: user.id,
      verifyStatus: user.verify_status
    })
    setTokenCookie(res, token)

    const refreshToken = generateRefreshToken({
      id: user.id,
      verifyStatus: user.verify_status
    })
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

    const token = generateAccessToken({
      id: user.id,
      verifyStatus: user.verify_status
    })
    setTokenCookie(res, token)

    const refreshToken = generateRefreshToken({
      id: user.id,
      verifyStatus: user.verify_status
    })
    await refreshTokenService.createRefreshToken(user.id, refreshToken)

    // Generate email verification token
    const emailVerifyToken = generateEmailVerifyToken(user.id)
    await db.User.update({ email_verify_token: emailVerifyToken }, { where: { id: user.id } })

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
    // Xóa refresh token khỏi cơ sở dữ liệu
    await storedToken.destroy()

    const token = generateAccessToken({
      id: user.id,
      verifyStatus: user.verify_status
    })
    setTokenCookie(res, token)

    return handleResponse(HttpStatusCode.SUCCESS, true, USERS_MESSAGES.TOKEN_REFRESHED, { token })
  }

  async loginGoogle({ accessToken }: { accessToken: string }, res: any) {
    try {
      const userInfo = await this.fetchGoogleUserInfo(accessToken)

      const { user, created } = await this.findOrCreateUser(userInfo)

      if (!user) {
        return handleResponse(HttpStatusCode.NOT_FOUND, false, USERS_MESSAGES.USER_NOT_FOUND)
      }

      const { token, refreshToken } = await this.generateAndSaveTokens(user, res)

      return handleResponse(
        HttpStatusCode.SUCCESS,
        true,
        created ? USERS_MESSAGES.REGISTER_SUCCESS : USERS_MESSAGES.LOGIN_SUCCESS,
        { token, refreshToken }
      )
    } catch (error: any) {
      return handleResponse(HttpStatusCode.BAD_REQUEST, false, error.message)
    }
  }

  async generateAndSaveTokens(user: any, res: any) {
    const token = generateAccessToken({
      id: user.id,
      verifyStatus: user.verify_status
    })
    setTokenCookie(res, token)

    const refreshToken = generateRefreshToken({
      id: user.id,
      verifyStatus: user.verify_status
    })
    await refreshTokenService.createRefreshToken(user.id, refreshToken)

    return { token, refreshToken }
  }

  async findOrCreateUser({ email, sub, name }: { email: string; sub: string; name: string }) {
    const [user, created] = await db.User.findOrCreate({
      where: { email },
      defaults: {
        email,
        name,
        username: sub,
        password: '' // Placeholder for Google login
      }
    })

    return { user, created }
  }

  async fetchGoogleUserInfo(accessToken: string) {
    const url = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
    const response = await axios.get(url)
    const { email, sub, name } = response.data

    if (!email || !sub || !name) {
      throw new Error(USERS_MESSAGES.EMAIL_IS_INVALID)
    }

    return { email, sub, name }
  }
}

export default new AuthServices()
