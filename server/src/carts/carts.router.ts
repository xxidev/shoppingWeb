import express from 'express'
import {
  createOrUpdateCart,
  deleteCart,
  getCartByUserId,
  updateCartItem
} from 'carts/carts.controller'
import authentication from 'middlewares/authentication.middleware'

const router = express.Router()

router.post('/', createOrUpdateCart)
router.delete('/', deleteCart)
router.put('/items', updateCartItem)
router.get('/', authentication, getCartByUserId)
export default router
