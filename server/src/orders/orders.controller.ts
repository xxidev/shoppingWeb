import { Request, Response } from 'express'
import Product from 'products/products.model'
import Order from 'orders/orders.model'
import OrderItem from 'orders/orderItems.model'

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId } = res.locals
    const { items } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No order items provided' })
    }

    const products = await Promise.all(
      items.map(item => Product.findByPk(item.productId))
    )

    const validOrderItems = items
      .map((item, index) => {
        const product = products[index]
        if (!product) return null
        return {
          product,
          productId: item.productId,
          quantity: item.quantity,
          itemTotal: Number(product.dataValues.price) * item.quantity
        }
      })
      .filter(Boolean)

    if (validOrderItems.length !== items.length) {
      return res.status(404).json({ error: 'One or more products not found' })
    }

    const totalAmount = validOrderItems.reduce(
      (sum, item) => sum + item.itemTotal,
      0
    )

    const order = await Order.create({ totalAmount, userId })

    await Promise.all(
      validOrderItems.map(item =>
        OrderItem.create({
          orderId: order.dataValues.id,
          productId: item.productId,
          quantity: item.quantity
        })
      )
    )

    const fullOrder = await Order.findByPk(order.dataValues.id, {
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ['id', 'name', 'price']
            }
          ]
        }
      ]
    })

    res.status(201).json(fullOrder)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message || 'Failed to create order' })
  }
}

export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          as: 'OrderItems',
          include: [{ model: Product, as: 'Product' }]
        }
      ]
    })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
}

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          as: 'OrderItems',
          include: [{ model: Product, as: 'Product' }]
        }
      ]
    })
    if (!order) return res.status(404).json({ error: 'Order not found' })
    res.json(order)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' })
  }
}

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findByPk(req.params.id)
    if (!order) return res.status(404).json({ error: 'Order not found' })

    await order.destroy()
    res.status(204).end()
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order' })
  }
}
