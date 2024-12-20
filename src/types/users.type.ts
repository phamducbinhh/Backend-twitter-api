export interface UserType {
  id: number
  name: string
  email: string
  date_of_birth: Date
  password: string
  email_verify_token: string
  forgot_password_token: string
  bio: string
  location: string
  website: string
  username: string
  cover_photo: string
  createdAt: Date
  updatedAt: Date
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
