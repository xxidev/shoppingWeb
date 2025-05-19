import { Request, Response } from 'express'
import Cart from 'carts/carts.model'
import CartItem from 'carts/cartItems.model'
import Product from 'products/products.model'

export const createOrUpdateCart = async (req: Request, res: Response) => {
  try {
    const { userId } = res.locals
    const { items } = req.body
    console.log('items ', items)
    // 查找用户是否已有购物车
    let cart = await Cart.findOne({ where: { userId } })

    // 如果没有就创建一个新购物车
    if (!cart) {
      cart = await Cart.create({ userId })
    }

    const cartItems: any[] = []

    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        const existingItem = await CartItem.findOne({
          where: {
            cartId: cart.dataValues.id,
            productId: item.productId
          }
        })

        if (existingItem) {
          // 商品已存在，更新数量（累加）
          await existingItem.update({
            quantity: existingItem.dataValues.quantity + item.quantity
          })
          cartItems.push(existingItem)
        } else {
          // 商品不存在，新增
          const newItem = await CartItem.create({
            cartId: cart.dataValues.id,
            productId: item.productId,
            quantity: item.quantity
          })
          cartItems.push(newItem)

          console.log('newItem', newItem.dataValues)
        }
      }
    }

    res.status(201).json({
      cartItems
    })
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
    const { cartItemId } = req.params
    const { quantity } = req.body

    const cartItem = await CartItem.findByPk(cartItemId)

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' })
    }

    if (quantity === 0) {
      await cartItem.destroy()
      return res.json({ message: 'Cart item removed' })
    }

    await cartItem.update({ quantity })

    res.json({ message: 'Cart item updated', cartItem })
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
