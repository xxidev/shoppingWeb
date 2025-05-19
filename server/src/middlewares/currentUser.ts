import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import User from 'users/users.model'
import { getUser } from 'utils/cognito'
import AppError from 'utils/appError'

const currentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.path === '/api/users/refresh-token') {
      return next()
    }
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1]
      const result = await getUser(token)
      res.locals.userId = result.Username

      const user = await User.findByPk(res.locals.userId)
      if (!user) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .json({ error: 'User not found' })
      }
      res.locals.email = user.dataValues.email
      res.locals.userId = user.dataValues.id
    }
    next()
  } catch (error) {
    next(new AppError(401, 'NotAuthorizedException: Invalid Access Token'))
  }
}

export default currentUser
