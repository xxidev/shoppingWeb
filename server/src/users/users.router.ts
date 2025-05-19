import express from 'express'
import {
  getUsers,
  getUserByIdController,
  signUpController,
  updateUserController,
  deleteUserController,
  loginController,
  refreshTokenController
} from './users.controller'

const router = express.Router()

router.get('/', getUsers)

router.get('/:id', getUserByIdController)

router.post('/', signUpController)

router.put('/:id', updateUserController)

router.delete('/:id', deleteUserController)

router.post('/login', loginController)

router.post('/refresh-token', refreshTokenController)
export default router
