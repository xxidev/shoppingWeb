import express from 'express'
import {
  createOrder,
  getAllOrders,
  getOrderById,
  deleteOrder
} from 'orders/orders.controller'

const router = express.Router()

router.post('/', createOrder)
router.get('/', getAllOrders)
router.get('/:id', getOrderById)
router.delete('/:id', deleteOrder)

export default router
