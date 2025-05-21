import express from 'express'
import Stripe from 'stripe'
const router = express.Router()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil'
})

router.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // 单位是“分” -> $10.99 = 1099
      currency: 'usd'
    })

    res.json({ clientSecret: paymentIntent.client_secret })
  } catch (err: any) {
    console.error(err.message)
    res.status(500).json({ error: err.message })
  }
})

export default router
