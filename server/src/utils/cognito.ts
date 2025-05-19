import config from 'config'
import {
  AdminInitiateAuthCommand,
  AuthFlowType,
  CognitoIdentityProviderClient,
  GetUserCommand,
  InitiateAuthCommand,
  SignUpCommand
} from '@aws-sdk/client-cognito-identity-provider'
import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'

export const cognitoClient = new CognitoIdentityProviderClient({
  region: config.aws.region
})
export const signUp = async (email: string, password: string) => {
  const signUpParams = {
    ClientId: config.aws.cognitoClientId,
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: 'email',
        Value: email
      }
    ]
  }

  try {
    return await cognitoClient.send(new SignUpCommand(signUpParams))
  } catch (error) {
    console.error('SignUp error', error)
    throw error
  }
}

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

    return {
      success: true,
      data: {
        idToken: IdToken,
        accessToken: AccessToken,
        refreshToken: RefreshToken,
        id
      }
    }
  } catch (err: any) {
    console.error('Login error:', err)

    if (err.name === 'UserNotConfirmedException') {
      return {
        success: false,
        status: httpStatus.FORBIDDEN,
        error: 'Account has not been confirmed.'
      }
    }

    if (err.name === 'NotAuthorizedException') {
      return {
        success: false,
        status: httpStatus.UNAUTHORIZED,
        error: 'Incorrect email or password.'
      }
    }

    if (err.name === 'UserNotFoundException') {
      return {
        success: false,
        status: httpStatus.UNAUTHORIZED,
        error: 'User not found.'
      }
    }

    return {
      success: false,
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: 'Unexpected error during login.'
    }
  }
}

export const getUser = async (accessToken: string) => {
  const command = new GetUserCommand({
    AccessToken: accessToken
  })

  try {
    return await cognitoClient.send(command)
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getAccessTokenByRefreshToken = async (refreshToken: string) => {
  return await cognitoClient.send(
    new AdminInitiateAuthCommand({
      UserPoolId: config.aws.cognitoUserPoolId,
      ClientId: config.aws.cognitoClientId,
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      AuthParameters: {
        REFRESH_TOKEN: refreshToken
      }
    })
  )
}
