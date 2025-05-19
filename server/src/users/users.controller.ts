import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { asyncHandler } from 'utils/errorHandler'
import User from 'users/users.model'
import {
  cognitoClient,
  getAccessTokenByRefreshToken,
  login,
  signUp
} from 'utils/cognito'
import { AdminInitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider'
import config from 'config' // 请确保路径正确
// import { getAccessTokenByRefreshToken } from 'routes/users/accounts.service'

// 获取所有用户（分页）
export const getUsers = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1
  const limit = 10
  const offset = (page - 1) * limit

  const { count, rows } = await User.findAndCountAll({
    limit,
    offset,
    order: [['created_at', 'DESC']]
  })

  return res.status(httpStatus.OK).json({
    totalUsers: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    users: rows
  })
}

// 获取单个用户
export const getUserByIdController = async (req: Request, res: Response) => {
  const { id } = req.params

  const user = await User.findByPk(id)
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).json({ error: 'User not found' })
  }

  return res.status(httpStatus.OK).json(user)
}

export const signUpController = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body

    const existing = await User.findOne({ where: { email } })
    if (existing) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: 'Email already in use' })
    }

    const result = await signUp(email, password)

    if (result && result.UserSub) {
      const user = await User.create({ id: result.UserSub, email, name })

      return res.status(httpStatus.CREATED).json(user)
    }
  } catch (error) {
    console.error('Error creating user:', error)
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Failed to create user' })
  }
}
// 更新用户
export const updateUserController = async (req: Request, res: Response) => {
  const { id } = req.params
  const { email, name } = req.body

  const user = await User.findByPk(id)
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).json({ error: 'User not found' })
  }

  await user.update({ email, name })
  return res.status(httpStatus.OK).json(user)
}

// 删除用户
export const deleteUserController = async (req: Request, res: Response) => {
  const { id } = req.params

  const user = await User.findByPk(id)
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).json({ error: 'User not found' })
  }

  await user.destroy()
  return res.status(httpStatus.NO_CONTENT).send()
}

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body
  const result = await login(email, password)

  if (!result.success) {
    return res.status(result.status).json({ error: result.error })
  }

  return res.status(httpStatus.OK).json(result.data)
}

export const refreshTokenController = async (req: Request, res: Response) => {
  const { refreshToken } = req.body

  const response = await getAccessTokenByRefreshToken(refreshToken)

  const accessToken = response.AuthenticationResult.AccessToken

  if (response.AuthenticationResult) {
    return res.status(httpStatus.OK).json({ accessToken })
  }
}
