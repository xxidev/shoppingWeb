import { Request, Response, NextFunction } from 'express'
import errorHandler from 'utils/errorHandler'
import AppError from 'utils/appError'
import httpStatus from 'http-status'

const errorHandling = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  errorHandler.handleError(error)
  const isTrusted = errorHandler.isTrustedError(error)
  const httpStatusCode = isTrusted
    ? (error as AppError).httpCode
    : httpStatus.INTERNAL_SERVER_ERROR
  const responseError = error.message

  res.status(httpStatusCode).json({
    error: responseError
  })
}

export default errorHandling
