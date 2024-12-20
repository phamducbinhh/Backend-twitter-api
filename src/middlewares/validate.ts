import { validationResult } from 'express-validator'

export const validate = (requestType: any) => {
  return async (req: any, res: any, next: any) => {
    await Promise.all(requestType.validationRules().map((validation: any) => validation.run(req)))

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map((error) => error.msg)
      })
    }

    next()
  }
}
