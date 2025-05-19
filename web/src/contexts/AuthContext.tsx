import React, { createContext, ReactNode, useEffect } from 'react'
import useAuth, { AccountInfo } from 'hooks/useAuth'

type AuthContextType = {
  logout: () => void
  login: (email: string, password: string) => Promise<void>
  // fetchAccountInfo: () => Promise<void>
  updateName: (firstName: string, lastName: string) => Promise<void>
  isAuthenticated: boolean
  // accountInfo: AccountInfo | null
}

export const AuthContext = createContext<AuthContextType>({
  logout: () => {
    throw new Error('logout method not implemented')
  },
  login: async () => {
    throw new Error('login method not implemented')
  },
  // fetchAccountInfo: async () => {
  //   throw new Error('fetchAccountInfo method not implemented')
  // },
  updateName: async () => {
    throw new Error('updateName method not implemented')
  },
  isAuthenticated: false
  // accountInfo: null
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    logout,
    login,
    updateName,
    // fetchAccountInfo,
    isAuthenticated
    // accountInfo
  } = useAuth()

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     fetchAccountInfo()
  //   }
  // }, [isAuthenticated])

  return (
    <AuthContext.Provider
      value={{
        logout,
        login,
        // fetchAccountInfo,
        updateName,
        isAuthenticated
        // accountInfo
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
