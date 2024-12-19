import bcrypt from 'bcrypt'
import { HttpStatusCode } from '~/constants/HttpStatusCode'
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
      return this.handleResponse(HttpStatusCode.BAD_REQUEST, false, 'Vui lòng cung cấp email')
    }

    try {
      const user = await db.User.findOne({ where: { email } })

      if (!user) {
        return this.handleResponse(HttpStatusCode.NOT_FOUND, false, 'Email không tồn tại trong hệ thống')
      }

      if (!user.password) {
        return this.handleResponse(HttpStatusCode.BAD_REQUEST, false, 'Vui lòng đăng nhập bằng Google/Facebook.')
      }

      if (!this.comparePassword(password, user.password)) {
        return this.handleResponse(HttpStatusCode.UNAUTHORIZED, false, 'Mật khẩu không chính xác')
      }

      const token = generateToken(user.id)
      this.setTokenCookie(res, token)

      return this.handleResponse(HttpStatusCode.SUCCESS, true, 'Đăng nhập thành công', { token })
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async register({ body }: { body: RegisterUserData }, res: any) {
    const { email, password, confirmPassword, name, date_of_birth } = body

    try {
      const userExists = await db.User.findOne({
        where: { [db.Sequelize.Op.or]: [{ email }] }
      })

      if (userExists) {
        return this.handleResponse(HttpStatusCode.CONFLICT, false, 'Email đã tồn tại trong hệ thống')
      }

      if (password !== confirmPassword) {
        return this.handleResponse(HttpStatusCode.BAD_REQUEST, false, 'Mật khẩu không trùng nhau')
      }

      const hashedPassword = this.hashPassword(password)
      const user = await db.User.create({
        email,
        name,
        date_of_birth,
        password: hashedPassword,
        confirmPassword: hashedPassword
      })

      const token = generateToken(user.id)
      this.setTokenCookie(res, token)

      return this.handleResponse(HttpStatusCode.CREATED, true, 'Đăng ký thành công', { token })
    } catch (error: any) {
      throw new Error(error.message)
    }
  }
}

export default new AuthServices()
