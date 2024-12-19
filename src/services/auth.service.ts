import bcrypt from 'bcrypt'
import { HttpStatusCode } from '~/constants/HttpStatusCode'
import { USERS_MESSAGES } from '~/constants/messages'
import { LoginUserData } from '~/schema/user/login.schema'
import { RegisterUserData } from '~/schema/user/register.schema'
import generateToken from '~/utils/jwt'
const db = require('../models')

class AuthServices {
  private hashPassword(password: string): string {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(12))
  }

  private comparePassword(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword)
  }

  private setTokenCookie(res: any, token: string): void {
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    })
  }

  private handleResponse(statusCode: number, success: boolean, message: string, data: any = null) {
    return { statusCode, success, message, ...(data && { data }) }
  }

  async login({ body }: { body: LoginUserData }, res: any) {
    const { email, password } = body

    if (!email) {
      return this.handleResponse(HttpStatusCode.BAD_REQUEST, false, USERS_MESSAGES.EMAIL_IS_REQUIRED)
    }

    const user = await db.User.findOne({ where: { email } })

    if (!user) {
      return this.handleResponse(HttpStatusCode.NOT_FOUND, false, USERS_MESSAGES.EMAIL_INCORRECT)
    }

    if (!this.comparePassword(password, user.password)) {
      return this.handleResponse(HttpStatusCode.UNAUTHORIZED, false, USERS_MESSAGES.PASSWORD_IS_INCORRECT)
    }

    const token = generateToken(user.id)
    this.setTokenCookie(res, token)

    const refreshToken = generateToken(user.id, '7d')
    await db.RefreshToken.create({ token: refreshToken, user_id: user.id })

    return this.handleResponse(HttpStatusCode.SUCCESS, true, USERS_MESSAGES.LOGIN_SUCCESS, { token, refreshToken })
  }

  async register({ body }: { body: RegisterUserData }, res: any) {
    const { email, password, confirmPassword, name, date_of_birth } = body

    const userExists = await db.User.findOne({
      where: { [db.Sequelize.Op.or]: [{ email }] }
    })

    if (userExists) {
      return this.handleResponse(HttpStatusCode.CONFLICT, false, USERS_MESSAGES.EMAIL_ALREADY_EXISTS)
    }

    if (password !== confirmPassword) {
      return this.handleResponse(
        HttpStatusCode.BAD_REQUEST,
        false,
        USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD
      )
    }
    const hashedPassword = this.hashPassword(password)
    const user = await db.User.create({
      email,
      name,
      username: name.toLowerCase().replace(/\s+/g, ''),
      date_of_birth,
      password: hashedPassword,
      confirmPassword: hashedPassword
    })

    const token = generateToken(user.id)
    this.setTokenCookie(res, token)

    const refreshToken = generateToken(user.id, '7d')
    await db.RefreshToken.create({ token: refreshToken, user_id: user.id })

    return this.handleResponse(HttpStatusCode.CREATED, true, USERS_MESSAGES.REGISTER_SUCCESS, { token, refreshToken })
  }

  async refreshToken({ body }: { body: { refreshToken: string } }, res: any) {
    const { refreshToken } = body

    const storedToken = await db.RefreshToken.findOne({ where: { token: refreshToken } })
    if (!storedToken) {
      return this.handleResponse(HttpStatusCode.BAD_REQUEST, false, USERS_MESSAGES.REFRESH_TOKEN_IS_INVALID)
    }

    const user = await db.User.findOne({ where: { id: storedToken.user_id } })
    if (!user) {
      return this.handleResponse(HttpStatusCode.NOT_FOUND, false, USERS_MESSAGES.USER_NOT_FOUND)
    }

    const token = generateToken(user.id)
    this.setTokenCookie(res, token)

    return this.handleResponse(HttpStatusCode.SUCCESS, true, USERS_MESSAGES.TOKEN_REFRESHED, { token })
  }
}

export default new AuthServices()
