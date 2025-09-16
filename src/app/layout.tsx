import type React from 'react'
import type { Metadata } from 'next'
import { Lora } from 'next/font/google'
import { Open_Sans } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/global/Header'
import { Footer } from '@/components/global/Footer'
import AuthProvider from '@/providers/AuthProvider'
import { Toaster } from '@/components/ui/sonner'

const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lora',
})

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
})

export const metadata: Metadata = {
  title: 'Sarah Yousuph - Professional Content Writer',
  description:
    'Professional content writer helping brands turn ideas into compelling narratives',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='en'
      className={`${lora.variable} ${openSans.variable} antialiased`}
    >
      <AuthProvider>
        <body className='min-h-screen flex flex-col bg-white font-sans'>
          <Header />
          <main className='flex-1'>{children}</main>
          <Footer />
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  )
}
