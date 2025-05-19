import express from 'express'
import currentUser from 'middlewares/currentUser'
import { errors } from 'celebrate'
import errorHandling from 'middlewares/errorHandling.middleware'
import cors from 'cors'
import apiRouter from 'api.router'
const app = express()

app.use(express.json()) // 确保能解析 JSON 请求体

// 注册用户路由
app.use(cors())
app.use(currentUser)
app.use('/api', apiRouter)
app.use(errors())
app.use(errorHandling)
export default app
