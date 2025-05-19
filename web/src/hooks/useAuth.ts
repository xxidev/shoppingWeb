import { useContext, useState } from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { axios, clearAuthData } from 'api'

export type AccountInfo = {
  firstName: string
  lastName: string
  email: string
}

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => !!Cookies.get('accessToken')
  )
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null)
  const navigate = useNavigate()

  const logout = () => {
    setIsAuthenticated(false)
    clearAuthData()
    navigate('/login')
  }

  const login = async (email: string, password: string) => {
    const response = await axios.post('/users/login', {
      email,
      password
    })
    if (response.status === 200) {
      const { accessToken, refreshToken } = response.data
      setIsAuthenticated(true)
      Cookies.set('accessToken', accessToken)
      Cookies.set('refreshToken', refreshToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    } else {
      const errorMessage =
        response?.data?.error || 'An unexpected error occurred.'
      console.log(errorMessage)
    }
  }

  // const fetchAccountInfo = async () => {
  //   const response = await axios.get('/users/me')
  //   if (response.status === 200) {
  //     setAccountInfo(response.data)
  //   } else {
  //     console.error('Failed to fetch account info.')
  //   }
  // }

  const updateName = async (firstName: string, lastName: string) => {
    const response = await axios.put('/users/update-name', {
      firstName,
      lastName
    })
    if (response.status === 200) {
      const updatedAccountInfo = response.data
      setAccountInfo(prevAccountInfo =>
        prevAccountInfo
          ? { ...prevAccountInfo, ...updatedAccountInfo }
          : updatedAccountInfo
      )

      console.log('Name updated successfully')
    } else {
      const errorMessage =
        response?.data?.error || 'An unexpected error occurred.'
      console.log(errorMessage)
    }
  }

  const confirmEmailUpdateVerification = async (
    code: string,
    newEmail: string
  ) => {
    const response = await axios.put('/users/update-email/confirm', {
      code,
      newEmail
    })
    if (response.status === 200) {
      const updatedEmail = response.data.email
      setAccountInfo(prevAccountInfo =>
        prevAccountInfo
          ? { ...prevAccountInfo, email: updatedEmail }
          : { firstName: '', lastName: '', email: updatedEmail }
      )
      console.log('Email updated successfully')
    } else {
      console.log('Email update failed')
    }
  }

  return {
    logout,
    login,
    // fetchAccountInfo,
    updateName,
    confirmEmailUpdateVerification,
    isAuthenticated,
    accountInfo
  }
}

export default useAuth
