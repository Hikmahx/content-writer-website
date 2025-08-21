import { Instagram, Linkedin, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className='w-full py-8 px-6 lg:px-12 border-t'>
      <div className='max-w-7xl mx-auto flex items-center justify-between'>
        <p className='text-sm text-muted-foreground'>
          © 2025 Sarah Yousuph, all rights reserved. | Site by Hikmah
        </p>

        <div className='flex items-center space-x-4'>
          <a
            href='#'
            className='text-muted-foreground hover:text-foreground transition-colors'
          >
            <Instagram className='w-5 h-5' />
          </a>
          <a
            href='#'
            className='text-muted-foreground hover:text-foreground transition-colors'
          >
            <Linkedin className='w-5 h-5' />
          </a>
          <a
            href='#'
            className='text-muted-foreground hover:text-foreground transition-colors'
          >
            <Mail className='w-5 h-5' />
          </a>
          <span className='text-muted-foreground text-lg font-bold'>M</span>
        </div>
      </div>
    </footer>
  )
}
