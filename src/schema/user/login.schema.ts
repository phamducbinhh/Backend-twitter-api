import bcrypt from 'bcrypt'
import { Request } from 'express'
import { body, Result, ValidationError, validationResult } from 'express-validator'

export interface LoginUserData {
  email?: string
  password: string
}

export class LoginUserSchema {
  email?: string
  password: string

  constructor(data: LoginUserData) {
    this.email = data.email
    this.password = this.hashPassword(data.password)
  }

  private hashPassword(password: string): string {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(12))
  }

  static validationRules() {
    return [
      body('email').optional().isEmail().withMessage('Email không hợp lệ'),
      body('password')
        .isLength({ min: 6 })
        .withMessage('Password phải có ít nhất 6 ký tự')
        .notEmpty()
        .withMessage('Password là bắt buộc')
    ]
  }

  static validate(req: Request): { isValid: boolean; errors: ValidationError[] } {
    const errors: Result<ValidationError> = validationResult(req)
    if (!errors.isEmpty()) {
      return {
        isValid: false,
        errors: errors.array()
      }
    }
    return { isValid: true, errors: [] }
  }
}
