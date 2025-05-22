import { axios } from 'api'
import { CartItem, Item } from 'contexts/CartContext'
import { useState } from 'react'
import { Source } from '@stripe/stripe-js'

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const fetchCartItems = async () => {
    try {
      const response = await axios.get('/carts')
      setCartItems(response.data)
    } catch (error) {
      console.error('Failed to fetch cart items:', error)
    }
  }

  const addToCart = async (items: Item[]) => {
    try {
      const response = await axios.post('/carts', {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      })

      setCartItems(response.data)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }
  const clearCart = async () => {
    try {
      await axios.delete('/carts')
      setCartItems([])
    } catch (error) {
      console.error('Failed to clear cart:', error)
    }
  }

  const updateCartItemQuantity = async (
    cartItemId: string,
    newQuantity: number
  ) => {
    try {
      const response = await axios.put('/carts/items/', {
        cartItemId,
        quantity: newQuantity
      })
      setCartItems(response.data)
    } catch (error) {
      console.error('Failed to update cart item quantity:', error)
    }
  }
  return {
    cartItems,
    fetchCartItems,
    addToCart,
    updateCartItemQuantity,
    clearCart
  }
}
