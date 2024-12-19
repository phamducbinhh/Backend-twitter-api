const db = require('../models')
import bcrypt from 'bcrypt'
import { envConfig } from '~/constants/config'
import { LoginUserData } from '~/schema/user/login.schema'
import { RegisterUserData } from '~/schema/user/register.schema'
import generateToken from '~/utils/jwt'

class AuthServices {
  hashPassword(password: string) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(12))
  }

  comparePassword(password: string, hashedPassword: string) {
    return bcrypt.compareSync(password, hashedPassword)
  }

  setTokenCookie(res: any, token: string) {
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: envConfig.jwtExpiresCookies
    })
  }

  async login({ body }: { body: LoginUserData }, res: any) {
    const { email, password } = body

    if (!email) {
      return { success: false, message: 'Vui lòng cung cấp email' }
    }

    try {
      const user = await db.User.findOne({
        where: {
          email
        }
      })

      if (!user) {
        return { success: false, message: 'Email không tồn tại trong hệ thống' }
      }

      if (!user.password) {
        return { success: false, message: 'Vui lòng đăng nhập bằng Google/Facebook.' }
      }

      if (!this.comparePassword(password, user.password)) {
        return { success: false, message: 'Mật khẩu không chính xác' }
      }

      const token = generateToken(user.id)
      this.setTokenCookie(res, token)

      return { success: true, message: 'Đăng nhập thành công', token }
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
        return { success: false, message: `Email đã tồn tại trong hệ thống` }
      }

      const user = await db.User.create({
        email,
        name,
        date_of_birth,
        password: this.hashPassword(password),
        confirmPassword: this.hashPassword(confirmPassword)
      })

      const token = generateToken(user.id)
      this.setTokenCookie(res, token)

      return { success: true, message: 'Đăng ký thành công', token }
    } catch (error: any) {
      throw new Error(error.message)
    }
  }
}

const authService = new AuthServices()
export default authService
