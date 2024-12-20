import { Request } from 'express'
import { body, Result, ValidationError, validationResult } from 'express-validator'
import { LoginReqBody } from '~/types/users.type'
import { hashPassword } from '~/utils/bcrypt'

export class LoginUserSchema {
  email?: string
  password: string

  constructor(data: LoginReqBody) {
    this.email = data.email
    this.password = hashPassword(data.password)
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
