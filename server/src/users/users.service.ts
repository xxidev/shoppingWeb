import {
  AuthFlowType,
  InitiateAuthCommand
} from '@aws-sdk/client-cognito-identity-provider'
import config from 'config'
import { cognitoClient } from 'utils/cognito'
import jwt from 'jsonwebtoken'

import AppError from 'utils/appError'
import httpStatus from 'http-status'
import User from 'users/users.model'

export const login = async (email: string, password: string) => {
  const loginParams = {
    ClientId: config.aws.cognitoClientId,
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password
    }
  }

  try {
    const { AuthenticationResult } = await cognitoClient.send(
      new InitiateAuthCommand(loginParams)
    )

    const { IdToken, AccessToken, RefreshToken } = AuthenticationResult
    const decoded = jwt.decode(IdToken) as { sub: string }
    const id = decoded.sub

    const user = await User.findByPk(id)
    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Account not found.')
    }

    return {
      idToken: IdToken,
      accessToken: AccessToken,
      refreshToken: RefreshToken,
      id,
      role: user.dataValues.role
    }
  } catch (err: any) {
    if (err.name === 'UserNotConfirmedException') {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'Account has not been confirmed.'
      )
    }

    if (err.name === 'NotAuthorizedException') {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Incorrect email or password.'
      )
    }

    if (err.name === 'UserNotFoundException') {
      throw new AppError(httpStatus.UNAUTHORIZED, 'User not found.')
    }

    console.error('Unexpected login error:', err)
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Unexpected error during login.'
    )
  }
}
