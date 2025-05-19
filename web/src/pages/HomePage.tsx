import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button
} from '@mui/material'
import { CartContext } from 'contexts/CartContext'

type Product = {
  id: string
  name: string
  price: number
  image: string
}

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/products')
        setProducts(res.data)
      } catch (err) {
        console.error('Failed to fetch products:', err)
      }
    }

    fetchProducts()
  }, [])

  const { addToCart } = useContext(CartContext)
  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      productId: String(product.id),
      quantity: 1,
      name: product.name,
      price: product.price
    })
  }

  return (
    <Container maxWidth='lg' sx={{ mt: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant='h3' gutterBottom>
          Welcome to Our Online Store
        </Typography>
        <Typography variant='h6'>
          Discover the latest deals and best-selling products today!
        </Typography>
        <Button variant='contained' size='large' sx={{ mt: 3 }}>
          Shop Now
        </Button>
      </Box>

      <Typography variant='h4' gutterBottom>
        Featured Products
      </Typography>

      <Grid container spacing={4}>
        {products.map(product => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <CardMedia
                component='img'
                image={product.image}
                alt={product.name}
                sx={{ height: 200 }}
              />
              <CardContent>
                <Typography gutterBottom variant='h6'>
                  {product.name}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  ${Number(product.price || 0).toFixed(2)}
                </Typography>
                <Button
                  variant='outlined'
                  size='small'
                  sx={{ mt: 2 }}
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default HomePage
