import AppError from 'utils/appError'

class ErrorHandler {
  public handleError(error: Error): void {}

  public isTrustedError(error: Error): boolean {
    if (error instanceof AppError) {
      return error.isOperational
    }
    return false
  }
}
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
export { asyncHandler }

export default new ErrorHandler()
