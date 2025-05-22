import { Request, Response } from 'express'
import Cart from 'carts/carts.model'
import CartItem from 'carts/cartItems.model'
import Product from 'products/products.model'

export const createOrUpdateCart = async (req: Request, res: Response) => {
  try {
    const { userId } = res.locals
    const { items } = req.body

    let cart = await Cart.findOne({ where: { userId } })

    if (!cart) {
      cart = await Cart.create({ userId })
    }

    for (const item of items) {
      const existingItem = await CartItem.findOne({
        where: {
          cartId: cart.dataValues.id,
          productId: item.productId
        }
      })

      if (existingItem) {
        await existingItem.update({
          quantity: existingItem.dataValues.quantity + item.quantity
        })
      } else {
        await CartItem.create({
          cartId: cart.dataValues.id,
          productId: item.productId,
          quantity: item.quantity
        })
      }
    }

    const cartItems = await CartItem.findAll({
      where: { cartId: cart.dataValues.id },
      include: [
        {
          model: Product,
          attributes: ['name', 'price']
        }
      ],
      order: [['createdAt', 'DESC']]
    })

    const response = cartItems.map(item => ({
      id: item.dataValues.id,
      productId: item.dataValues.productId,
      quantity: item.dataValues.quantity,
      name: item.dataValues.Product?.name,
      price: item.dataValues.Product?.price
    }))

    res.status(201).json(response)
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ error: error.message || 'Failed to create/update cart' })
  }
}

export const deleteCart = async (req: Request, res: Response) => {
  try {
    const { userId } = res.locals

    const cart = await Cart.findOne({ where: { userId } })

    if (!cart) {
      return res.status(404).json([])
    }

    await cart.destroy()
    res.status(204).end()
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to delete cart' })
  }
}
export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { cartItemId, quantity } = req.body

    const cartItem = await CartItem.findByPk(cartItemId)

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' })
    }

    if (quantity === 0) {
      await cartItem.destroy()
    } else {
      await cartItem.update({ quantity })
    }

    // 返回当前用户购物车项
    const { userId } = res.locals
    const cart = await Cart.findOne({ where: { userId } })
    if (!cart) return res.status(200).json([])

    const cartItems = await CartItem.findAll({
      where: { cartId: cart.dataValues.id },
      include: [
        {
          model: Product,
          attributes: ['name', 'price']
        }
      ],
      order: [['createdAt', 'DESC']]
    })

    const response = cartItems.map(item => ({
      id: item.dataValues.id,
      productId: item.dataValues.productId,
      quantity: item.dataValues.quantity,
      name: item.dataValues.Product?.name,
      price: item.dataValues.Product?.price
    }))

    res.status(200).json(response)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to update cart item quantity' })
  }
}

export const getCartByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = res.locals

    const cart = await Cart.findOne({ where: { userId } })
    if (!cart) return res.status(200).json([])

    const cartItems = await CartItem.findAll({
      where: { cartId: cart.dataValues.id },
      include: [
        {
          model: Product,
          attributes: ['name', 'price']
        }
      ]
    })

    const response = cartItems.map(item => ({
      id: item.dataValues.id,
      productId: item.dataValues.productId,
      quantity: item.dataValues.quantity,
      name: item.dataValues.Product?.name,
      price: item.dataValues.Product?.price
    }))

    res.status(200).json(response)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch cart items' })
  }
}
