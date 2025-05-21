import HomePage from 'pages/HomePage'
import Navbar from 'components/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from 'pages/Login/LoginPage'
import Footer from 'components/Footer'
import CartPage from 'pages/Cart/Cart'
import OrderPage from 'pages/Order/Order'
import { CartProvider } from 'contexts/CartContext'
import { AuthProvider } from 'contexts/AuthContext'
import ProtectedRoute from 'components/ProtectedRoute'
import ThankYouPage from 'pages/Order/ThankYouPage'

const App = () => {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route
                path='/cart'
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                }
              />
              <Route path='/order' element={<OrderPage />} />
              <Route path='/thank-you' element={<ThankYouPage />} />
            </Routes>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
