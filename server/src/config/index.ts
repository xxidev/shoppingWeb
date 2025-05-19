import * as dotenv from 'dotenv'
import { Sequelize } from 'sequelize'

const nodeEnv = process.env.NODE_ENV || 'local'
dotenv.config({ path: `.env.${nodeEnv}` })

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key]
  if (!value) {
    if (defaultValue !== undefined) return defaultValue
    throw new Error(`Environment variable ${key} is required`)
  }
  return value
}

const parseArray = (key: string, defaultValue: string[] = []): string[] => {
  const value = process.env[key]
  return value ? value.split(',').map(item => item.trim()) : defaultValue
}

const isLocal = process.env.NODE_ENV === 'local'

const dialectOptions = isLocal
  ? {}
  : {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }

export const sequelize = new Sequelize(
  getEnv('DB_DATABASE'),
  getEnv('DB_USERNAME'),
  getEnv('DB_PASSWORD'),
  {
    host: getEnv('DB_HOST'),
    dialect: 'postgres',
    port: parseInt(getEnv('DB_PORT', '5432'), 10),
    logging: false,
    dialectOptions
  }
)

const config = {
  nodeEnv,
  port: parseInt(getEnv('PORT', '3000'), 10),
  corsOrigins: parseArray('CORS_ORIGINS'),
  aws: {
    accessKeyId: getEnv('AWS_ACCESS_KEY_ID'),
    secretAccessKey: getEnv('AWS_SECRET_ACCESS_KEY'),
    region: getEnv('AWS_REGION', 'us-east-1'),
    cognitoUserPoolId: getEnv('AWS_COGNITO_USERPOOL_ID'),
    cognitoClientId: getEnv('AWS_COGNITO_CLIENT_ID')
  }
}

console.log(`Application running in ${config.nodeEnv} mode`)

export default config
