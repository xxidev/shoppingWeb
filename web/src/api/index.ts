import Cookies from 'js-cookie'
import axios from 'axios'

axios.defaults.baseURL = process.env.REACT_APP_API
axios.defaults.headers.common['Content-Type'] = 'application/json'

const accessToken = Cookies.get('accessToken')
axios.defaults.headers.common['Authorization'] = accessToken
  ? `Bearer ${accessToken}`
  : ''

export const clearAuthData = () => {
  Cookies.remove('accessToken')
  Cookies.remove('refreshToken')
  delete axios.defaults.headers.common['Authorization']
  localStorage.clear()
}

export const refreshAuthToken = async () => {
  const refreshToken = Cookies.get('refreshToken')

  if (!refreshToken) {
    clearAuthData()
    return
  }

  const response = await axios.post('/users/refresh-token', {
    refreshToken
  })

  if (response.status === 200) {
    const newAccessToken = response.data.accessToken
    Cookies.set('accessToken', newAccessToken)
    axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
    return newAccessToken
  } else {
    clearAuthData()
  }
}

axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const newAccessToken = await refreshAuthToken()
      if (newAccessToken) {
        Cookies.set('accessToken', newAccessToken)
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
        return axios(originalRequest)
      } else {
        clearAuthData()
      }
    }
    return Promise.resolve(error.response)
  }
)

export { axios }
