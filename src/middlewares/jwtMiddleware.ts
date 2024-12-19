import jwt, { JwtPayload } from 'jsonwebtoken'
import { envConfig } from '~/constants/config'
import { HttpStatusCode } from '~/constants/HttpStatusCode'
const db = require('../models')

const getUserFromToken = async (req: any, res: any) => {
  const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1]

  if (!token) {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({
      success: false,
      message: 'Không có token, truy cập bị từ chối'
    })
  }

  try {
    const jwtObject: JwtPayload | any = jwt.verify(token, envConfig.accessTokenExpiresIn as string)

    // Kiểm tra xem token có hết hạn không
    const isExpired = Date.now() >= jwtObject.exp * 1000
    if (isExpired) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        message: 'Token hết hạn'
      })
    }

    const user = await db.User.findOne({
      where: { id: jwtObject.id }
    })

    if (!user) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        success: false,
        message: 'Người dùng không tồn tại'
      })
    }

    return { user }
  } catch (error: any) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      message: error.message
    })
  }
}
export const verifyToken = async (req: any, res: any, next: any) => {
  const result = await getUserFromToken(req, res)
  if (result?.user) {
    req.user = result.user
    next()
  }
}
