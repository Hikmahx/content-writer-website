import Link from 'next/link'
import { FaEnvelope, FaLinkedinIn } from 'react-icons/fa'
import { FaUpwork } from 'react-icons/fa6'
import { BsSubstack } from "react-icons/bs";

const socialLinks = [
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
    href: 'https://www.upwork.com/freelancers/~0118c3507b9e418464',
    icon: FaUpwork,
    label: 'Upwork',
  },
  {
    href: 'https://substack.com/@sarahsplanet?r=129lex&utm_medium=ios&utm_source=profile',
    icon: BsSubstack,
    label: 'Substack',
  },
]

export function Footer() {
  return (
    <footer className='w-full pb-12 print:hidden'>
      <div className='max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8'>
        <p className='text-sm text-muted-foreground'>
          © {new Date().getFullYear()} Sarah Yousuph, all rights reserved. | Site by{' '}
          <Link
            href='https://hikmahyousuph.com'
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
