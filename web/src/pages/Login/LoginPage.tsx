import React, { useContext, useState } from 'react'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { AuthContext } from 'contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

type FormData = {
  email: string
  password: string
}

const LoginPage = () => {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: { email: '', password: '' }
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      await login(data.email, data.password)
      navigate('/')
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container maxWidth='sm' sx={{ mt: 8 }}>
      <Typography variant='h4' component='h1' gutterBottom>
        Sign In to Your Account
      </Typography>

      <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
        <Controller
          name='email'
          control={control}
          rules={{
            required: 'Email is required'
          }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label='Email Address'
              margin='normal'
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          )}
        />

        <Controller
          name='password'
          control={control}
          rules={{ required: 'Password is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label='Password'
              type={showPassword ? 'text' : 'password'}
              margin='normal'
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() => setShowPassword(prev => !prev)}
                      edge='end'
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          )}
        />

        <Button
          type='submit'
          variant='contained'
          color='primary'
          fullWidth
          disabled={isSubmitting}
          sx={{ mt: 3 }}
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>
      </Box>
    </Container>
  )
}

export default LoginPage
