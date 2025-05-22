import React, { useContext } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Badge,
  IconButton
} from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { AuthContext } from 'contexts/AuthContext'
import { CartContext } from 'contexts/CartContext' // ✅ 引入 CartContext

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext)
  const { cartItems } = useContext(CartContext) // ✅ 获取购物车数据

  const navigate = useNavigate()

  // ✅ 计算总数量
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <AppBar position='static' color='primary'>
      <Toolbar>
        {/* Logo or site name */}
        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
          <Link to='/' style={{ color: 'inherit', textDecoration: 'none' }}>
            MyStore
          </Link>
        </Typography>

        {/* Cart with Badge */}
        <IconButton color='inherit' onClick={() => navigate('/cart')}>
          <Badge badgeContent={totalQuantity} color='error'>
            <ShoppingCartIcon />
          </Badge>
        </IconButton>

        {/* Navigation buttons */}
        <Box>
          {isAuthenticated ? (
            <Button color='inherit' onClick={logout}>
              Logout
            </Button>
          ) : (
            <Button color='inherit' component={Link} to='/login'>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
