import { JwtPayload } from 'jsonwebtoken'
import { UserVerifyStatus } from '~/constants/enums'

export interface UserType {
  id: number
  name: string
  email: string
  date_of_birth: Date
  password?: string
  email_verify_token?: string
  forgot_password_token?: string
  bio: string
  location: string
  website: string
  username: string
  cover_photo: string
  avatar: string
  verify_status: number
  following?: any
  followers?: any
  createdAt?: Date
  updatedAt?: Date
}

export interface LoginReqBody {
  email: string
  password: string
}

export interface RegisterReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}

export interface RefreshTokenReqBody {
  refresh_token: string
}

export interface VerifyEmailReqBody {
  email_verify_token: string
}

export interface ForgotPasswordReqBody {
  email: string
}

export interface ResetPasswordReqBody {
  password: string
  confirm_password: string
  forgot_password_token: string
}

export interface TokenPayload extends JwtPayload {
  id: string
  verify: UserVerifyStatus
  exp: number
  iat: number
}

export interface UpdateMeReqBody {
  name?: string
  date_of_birth?: string
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
}

export interface FollowReqBody {
  followed_user_id: string
}
