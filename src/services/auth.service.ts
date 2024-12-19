import bcrypt from 'bcrypt'
import { HttpStatusCode } from '~/constants/HttpStatusCode'
import { USERS_MESSAGES } from '~/constants/messages'
import { LoginUserData } from '~/schema/user/login.schema'
import { RegisterUserData } from '~/schema/user/register.schema'
import { throwError } from '~/utils/errorResponse'
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

  async login({ body }: { body: LoginUserData }, res: any) {
    const { email, password } = body

    if (!email) {
      throwError(USERS_MESSAGES.EMAIL_IS_REQUIRED, HttpStatusCode.BAD_REQUEST)
    }

    const user = await db.User.findOne({ where: { email } })

    if (!user) {
      throwError(USERS_MESSAGES.EMAIL_INCORRECT, HttpStatusCode.NOT_FOUND)
    }

    if (!this.comparePassword(password, user.password)) {
      throwError(USERS_MESSAGES.PASSWORD_IS_INCORRECT, HttpStatusCode.BAD_REQUEST)
    }

    const token = generateToken(user.id)
    this.setTokenCookie(res, token)

    return {
      success: true,
      message: USERS_MESSAGES.LOGIN_SUCCESS,
      data: { token }
    }
  }

  async register({ body }: { body: RegisterUserData }, res: any) {
    const { email, password, confirmPassword, name, date_of_birth } = body

    const userExists = await db.User.findOne({
      where: { [db.Sequelize.Op.or]: [{ email }] }
    })

    if (userExists) {
      throwError(USERS_MESSAGES.EMAIL_ALREADY_EXISTS, HttpStatusCode.CONFLICT)
    }

    if (password !== confirmPassword) {
      throwError(USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD, HttpStatusCode.BAD_REQUEST)
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

    return {
      success: true,
      message: USERS_MESSAGES.REGISTER_SUCCESS,
      data: { token }
    }
  }
}

export default new AuthServices()
