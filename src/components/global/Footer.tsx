import Link from 'next/link'
import { FaEnvelope, FaInstagram, FaLinkedinIn } from 'react-icons/fa'
import { FaMedium } from 'react-icons/fa6'

const socialLinks = [
  {
    href: 'https://www.instagram.com/sarahs.odysseys/',
    icon: FaInstagram,
    label: 'Instagram',
  },
  {
    href: 'https://ng.linkedin.com/in/sarah-yousuph-8891a3237',
    icon: FaLinkedinIn,
    label: 'LinkedIn',
  },
  {
    href: 'mailto:adenikeangel.sy@gmail.com',
    icon: FaEnvelope,
    label: 'Email',
  },
  {
    href: 'https://medium.com/@sarahyousuph.sy',
    icon: FaMedium,
    label: 'Medium',
  },
]

export function Footer() {
  return (
    <footer className='w-full pb-12 print:hidden'>
      <div className='max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8'>
        <p className='text-sm text-muted-foreground'>
          © 2025 Sarah Yousuph, all rights reserved. | Site by{' '}
          <Link
            href='https://hikmah-yousuph.vercel.app/'
            className='text-gray-700 hover:text-beige underline'
            target='_blank'
            rel='noopener noreferrer'
          >
            Hikmah
          </Link>
        </p>

        <div className='flex items-center space-x-4'>
          {socialLinks.map(({ href, icon: Icon, label }) => (
            <Link
              key={label}
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              className='text-gray-800 hover:text-beige transition-colors'
            >
              <Icon className='w-5 h-5' />
              <span className='sr-only'>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
