import React, { createContext, ReactNode, useContext, useEffect } from 'react'
import { useCart } from 'hooks/useCart'
import { AuthContext } from 'contexts/AuthContext'

export interface CartItem {
  id: string
  productId: string
  quantity: number
  name: string
  price: number
}

export interface Item {
  productId: string
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (items: Item[]) => Promise<void>
  updateCartItemQuantity: (
    cartItemId: string,
    newQuantity: number
  ) => Promise<void>
  fetchCartItems: () => Promise<void>
  clearCart: () => Promise<void>
}

const defaultCartContextValue: CartContextType = {
  cartItems: [],
  addToCart: async () => {
    throw new Error('addToCart not implemented')
  },
  updateCartItemQuantity: async () => {
    throw new Error('updateCartItemQuantity not implemented')
  },
  fetchCartItems: async () => {
    throw new Error('fetchCartItems not implemented')
  },
  clearCart: () => {
    throw new Error('clearCart not implemented')
  }
}

export const CartContext = createContext<CartContextType>(
  defaultCartContextValue
)

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const {
    cartItems,
    fetchCartItems,
    addToCart,
    updateCartItemQuantity,
    clearCart
  } = useCart()

  const { isAuthenticated } = useContext(AuthContext)
  useEffect(() => {
    if (isAuthenticated) {
      fetchCartItems()
    }
  }, [isAuthenticated])

  return (
    <CartContext.Provider
      value={{
        cartItems,
        fetchCartItems,
        addToCart,
        updateCartItemQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
