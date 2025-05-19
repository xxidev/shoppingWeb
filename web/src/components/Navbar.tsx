import React, { useContext } from 'react'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from 'contexts/AuthContext'

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext)

  const navigate = useNavigate()
  return (
    <AppBar position='static' color='primary'>
      <Toolbar>
        {/* Logo or site name */}
        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
          <Link to='/' style={{ color: 'inherit', textDecoration: 'none' }}>
            MyStore
          </Link>
        </Typography>

        <Button color='inherit' onClick={() => navigate('/cart')}>
          Cart
        </Button>

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
