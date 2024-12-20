const db = require('../models')

class RefreshTokenService {
  async createRefreshToken(userId: number, token: string) {
    return db.RefreshToken.create({ token, user_id: userId })
  }

  async findRefreshToken(token: string) {
    return db.RefreshToken.findOne({ where: { token } })
  }

  async deleteRefreshTokensByUserId(userId: number) {
    return db.RefreshToken.destroy({ where: { user_id: userId } })
  }
}

export default new RefreshTokenService()
