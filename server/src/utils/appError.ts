export default class AppError extends Error {
  public readonly name: string

  public readonly httpCode: number

  public readonly isOperational: boolean

  constructor(
    httpCode: number,
    description: string,
    isOperational: boolean = true
  ) {
    super(description)

    Object.setPrototypeOf(this, new.target.prototype)

    this.httpCode = httpCode
    this.isOperational = isOperational

    Error.captureStackTrace(this)
  }
}
