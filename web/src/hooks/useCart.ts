import { axios } from 'api'
import { CartItem } from 'contexts/CartContext'
import { useState } from 'react'

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

  const addToCart = async (itemOrItems: CartItem | CartItem[]) => {
    try {
      const items = Array.isArray(itemOrItems) ? itemOrItems : [itemOrItems]

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
    } catch (error) {
      console.error('Failed to clear cart:', error)
    }
  }

  const removeCartItem = async (id: string) => {
    try {
      await axios.delete(`/carts/${id}`)
    } catch (error) {
      console.error('Failed to remove cart item:', error)
    }
  }

  const updateCartItemQuantity = async (id: string, newQuantity: number) => {
    try {
      const response = await axios.put(`/carts/items/${id}`, {
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
    removeCartItem,
    clearCart
  }
}
