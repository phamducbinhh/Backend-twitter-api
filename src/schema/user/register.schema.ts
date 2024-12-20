import { Request } from 'express'
import { body, Result, ValidationError, validationResult } from 'express-validator'
import { RegisterReqBody } from '~/types/users.type'
import { hashPassword } from '~/utils/bcrypt'

export class RegisterUserSchema {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string

  constructor(data: RegisterReqBody) {
    this.name = data.name
    this.email = data.email
    this.password = hashPassword(data.password)
    this.confirm_password = data.confirm_password
    this.date_of_birth = data.date_of_birth
  }

  static validationRules() {
    return [
      body('name').notEmpty().withMessage('Name là bắt buộc').isString().withMessage('Name phải là chuỗi'),

      body('email').notEmpty().withMessage('Email là bắt buộc').isEmail().withMessage('Email không hợp lệ'),

      body('password')
        .notEmpty()
        .withMessage('Password là bắt buộc')
        .isLength({ min: 6 })
        .withMessage('Password phải có ít nhất 6 ký tự'),

      body('confirm_password')
        .notEmpty()
        .withMessage('Confirm Password là bắt buộc')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Confirm Password phải khớp với Password'),

      body('date_of_birth')
        .notEmpty()
        .withMessage('Date of Birth là bắt buộc')
        .isISO8601()
        .withMessage('Date of Birth phải đúng định dạng ISO8601')
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
