'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeLink, setActiveLink] = useState('/')

  useEffect(() => {
    // Set active link based on current pathname
    setActiveLink(window.location.pathname)
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleLinkClick = (href: string) => {
    setActiveLink(href)
    setIsOpen(false)
  }

  return (
    <>
      <header className='w-full py-6 px-6 lg:px-12 relative z-50'>
        <nav className='flex items-center justify-between max-w-7xl mx-auto'>
          <Link
            href='/'
            className='text-xl font-semibold font-serif'
            onClick={() => handleLinkClick('/')}
          >
            SARAH YOUSUPH
          </Link>

          <div className='hidden md:!flex items-center space-x-8'>
            <Link
              href='/'
              className={`transition-colors font-sans ${
                activeLink === '/'
                  ? 'text-black font-medium'
                  : 'text-gray-700 hover:text-gray-500'
              }`}
              onClick={() => handleLinkClick('/')}
            >
              Home
            </Link>
            <Link
              href='/about'
              className={`transition-colors font-sans ${
                activeLink === '/about'
                  ? 'text-black font-medium'
                  : 'text-gray-700 hover:text-gray-500'
              }`}
              onClick={() => handleLinkClick('/about')}
            >
              About
            </Link>
            <Link
              href='/blog'
              className={`transition-colors font-sans ${
                activeLink === '/blog'
                  ? 'text-black font-medium'
                  : 'text-gray-700 hover:text-gray-500'
              }`}
              onClick={() => handleLinkClick('/blog')}
            >
              Blog
            </Link>
            <Link
              href='/resume'
              className={`transition-colors font-sans ${
                activeLink === '/resume'
                  ? 'text-black font-medium'
                  : 'text-gray-700 hover:text-gray-500'
              }`}
              onClick={() => handleLinkClick('/resume')}
            >
              Resume
            </Link>
            <Button className='bg-black text-white hover:bg-gray-800 px-6 font-sans'>
              Contact
            </Button>
          </div>

          <button
            onClick={toggleMenu}
            className='md:!hidden relative z-50 w-8 h-8 flex flex-col justify-center items-center space-y-1 group'
            aria-label='Toggle menu'
          >
            <span
              className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ease-in-out ${
                isOpen ? 'rotate-45 translate-y-1.5' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ease-in-out ${
                isOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ease-in-out ${
                isOpen ? '-rotate-45 -translate-y-1.5' : ''
              }`}
            />
          </button>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ease-in-out ${
          isOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        {/* Backdrop */}
        <div
          className='absolute inset-0 bg-black/20 backdrop-blur-sm'
          onClick={() => setIsOpen(false)}
        />

        {/* Mobile menu */}
        <div
          className={`absolute top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <nav className='flex flex-col pt-24 px-8'>
            {[
              { href: '/', label: 'Home' },
              { href: '/about', label: 'About' },
              { href: '/blog', label: 'Blog' },
              { href: '/resume', label: 'Resume' },
            ].map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xl font-sans py-4 border-b border-gray-100 transition-all duration-300 ease-in-out transform ${
                  isOpen
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-8 opacity-0'
                } ${
                  activeLink === item.href
                    ? 'text-black font-medium'
                    : 'text-gray-700 hover:text-gray-500'
                }`}
                style={{
                  transitionDelay: isOpen ? `${index * 100}ms` : '0ms',
                }}
                onClick={() => handleLinkClick(item.href)}
              >
                {item.label}
              </Link>
            ))}

            <Button
              className={`bg-black text-white hover:bg-gray-800 px-6 font-sans w-fit mt-8 transition-all duration-300 ease-in-out transform ${
                isOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
              }`}
              style={{
                transitionDelay: isOpen ? '400ms' : '0ms',
              }}
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Button>
          </nav>
        </div>
      </div>
    </>
  )
}
