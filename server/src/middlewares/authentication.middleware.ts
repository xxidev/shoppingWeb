import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import AppError from 'utils/appError'

const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (res.locals.userId) {
      next()
    } else {
      res.status(httpStatus.UNAUTHORIZED).json({ error: 'Unauthorized' })
    }
  } catch (error) {
    res.status(httpStatus.UNAUTHORIZED).json({ error: error.message })
    throw new AppError(httpStatus.UNAUTHORIZED, error)
  }
}

export default authentication
