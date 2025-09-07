'use client'

import { SessionProvider } from 'next-auth/react'
import type React from 'react'

const AuthProvider = ({ children }: {children: React.ReactNode}) => {
  return <SessionProvider>{children}</SessionProvider>
}

export default AuthProvider
