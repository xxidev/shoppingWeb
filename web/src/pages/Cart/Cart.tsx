import React, { useContext } from 'react'
import {
  Container,
  Typography,
  Box,
  Button,
  Divider,
  IconButton
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import CloseIcon from '@mui/icons-material/Close'
import { CartContext } from 'contexts/CartContext'
import { useNavigate } from 'react-router-dom'

const CartPage = () => {
  const { cartItems, updateCartItemQuantity, removeCartItem, clearCart } =
    useContext(CartContext)

  const calculateTotal = () => {
    return cartItems
      .reduce((acc, item) => acc + item.price * item.quantity, 0)
      .toFixed(2)
  }

  const handleIncrease = (itemId: string, currentQty: number) => {
    updateCartItemQuantity(itemId, currentQty + 1)
  }

  const handleDecrease = (itemId: string, currentQty: number) => {
    if (currentQty > 1) {
      updateCartItemQuantity(itemId, currentQty - 1)
    }
  }

  const handleRemove = (itemId: string) => {
    removeCartItem(itemId)
  }
  const navigate = useNavigate()

  return (
    <Container maxWidth='md' sx={{ mt: 6 }}>
      <Typography variant='h4' component='h1' gutterBottom>
        Your Shopping Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Typography variant='body1'>Your cart is empty.</Typography>
      ) : (
        <>
          {cartItems.map(item => (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 2
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton
                  onClick={() => handleDecrease(item.id, item.quantity)}
                  color='primary'
                >
                  <RemoveIcon />
                </IconButton>

                <Typography variant='body1' sx={{ mx: 2 }}>
                  {item.name} x {item.quantity}
                </Typography>

                <Typography variant='body1'>
                  ${(item.price * item.quantity).toFixed(2)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton
                  onClick={() => handleIncrease(item.id, item.quantity)}
                  color='primary'
                >
                  <AddIcon />
                </IconButton>
                <IconButton onClick={() => handleRemove(item.id)} color='error'>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
          <Divider sx={{ my: 3 }} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3
            }}
          >
            <Typography variant='h6'>Total:</Typography>
            <Typography variant='h6'>${calculateTotal()}</Typography>
          </Box>
          <Button
            variant='contained'
            color='primary'
            size='large'
            fullWidth
            sx={{ mb: 2 }}
            onClick={() => navigate('/order')}
          >
            Proceed to Checkout
          </Button>
          <Button
            variant='outlined'
            color='error'
            size='large'
            fullWidth
            onClick={() => clearCart()}
          >
            Clear Cart
          </Button>
        </>
      )}
    </Container>
  )
}

export default CartPage
