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
  Button,
  TextField,
  Pagination
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
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/products', {
          params: {
            search,
            page
          }
        })
        setProducts(res.data.products)
        setTotalPages(res.data.totalPages)
      } catch (err) {
        console.error('Failed to fetch products:', err)
      }
    }

    fetchProducts()
  }, [search, page])

  const { addToCart } = useContext(CartContext)

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

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}
      >
        <Typography variant='h4' gutterBottom>
          Featured Products
        </Typography>
        <TextField
          label='Search'
          variant='outlined'
          size='small'
          value={search}
          onChange={e => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />
      </Box>

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
                  onClick={() =>
                    addToCart([
                      {
                        productId: product.id,
                        quantity: 1
                      }
                    ])
                  }
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color='primary'
          />
        </Box>
      )}
    </Container>
  )
}

export default HomePage
