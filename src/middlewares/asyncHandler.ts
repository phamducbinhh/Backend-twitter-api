import { NextFunction, Request, Response } from 'express'

/**
 * Wrapper to handle async errors in route handlers and pass them to Express error middleware.
 * @param fn - Async function (route handler)
 * @returns Wrapped function
 */
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

export default asyncHandler
