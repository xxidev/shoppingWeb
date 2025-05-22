import React, { useContext, useEffect, useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Divider,
  Button,
  CircularProgress
} from '@mui/material'
import { CartContext } from 'contexts/CartContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

//这里
const stripePromise = loadStripe(
  'pk_test_51RQqniIIx7zbUAmeIzC6E3aASdVfuScK8bPQzeVMxLr4DSOQXquOwWY1uLdqAsVLhDkZoUWeuTPsfPIaGTcAUOMp00QuVUR1EH'
)

const CheckoutForm = ({ totalAmount }: { totalAmount: number }) => {
  const { cartItems, clearCart } = useContext(CartContext)
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await axios.post('/orders/create-payment-intent', {
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      })
      const clientSecret = res.data.clientSecret

      const result = await stripe?.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements?.getElement(CardElement)!
        }
      })

      if (result?.error) {
        setError(result.error.message || 'Payment failed')
      } else if (result?.paymentIntent?.status === 'succeeded') {
        const orderData = {
          items: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        }

        await axios.post('/orders', orderData)
        await clearCart()
        navigate('/thank-you')
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      {error && (
        <Typography color='error' sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      <Button
        variant='contained'
        type='submit'
        fullWidth
        sx={{ mt: 2 }}
        disabled={loading || !stripe}
      >
        {loading ? <CircularProgress size={24} /> : 'Pay & Place Order'}
      </Button>
    </form>
  )
}

const OrderPage = () => {
  const { cartItems } = useContext(CartContext)

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )

  return (
    <Container maxWidth='md' sx={{ mt: 6 }}>
      <Typography variant='h4' gutterBottom>
        Review & Pay
      </Typography>

      {cartItems.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <>
          {cartItems.map(item => (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                py: 1
              }}
            >
              <Typography>
                {item.name} x {item.quantity}
              </Typography>
              <Typography>
                ${(item.price * item.quantity).toFixed(2)}
              </Typography>
            </Box>
          ))}

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant='h6'>Total</Typography>
            <Typography variant='h6'>${totalAmount.toFixed(2)}</Typography>
          </Box>

          {/* Stripe Elements 支付区块 */}
          <Elements stripe={stripePromise}>
            <CheckoutForm totalAmount={totalAmount} />
          </Elements>
        </>
      )}
    </Container>
  )
}

export default OrderPage
