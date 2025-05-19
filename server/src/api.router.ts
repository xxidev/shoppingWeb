import { Router } from 'express'
import usersRouter from 'users/users.router'
import productsRouter from 'products/products.router'
import authentication from 'middlewares/authentication.middleware'
import ordersRouter from 'orders/orders.router'
import cartsRouter from 'carts/carts.router'

const router: Router = Router()
router.use('/users', usersRouter)
router.use('/products', productsRouter)
router.use('/orders', authentication, ordersRouter)
router.use('/carts', authentication, cartsRouter)

export default router
