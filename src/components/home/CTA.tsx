'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function CTA() {
  return (
    <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        className='py-20 text-white relative overflow-hidden bg-black rounded-lg'
      >
        <Image
          src='/cta-bg.svg'
          alt='bg cta'
          width={400}
          height={280}
          className='h-full absolute inset-y-0 -right-8'
        />
        <div className='relative px-6 lg:px-12'>
          <div className='grid lg:grid-cols-2 gap-12 items-center'>
            <div className='space-y-6'>
              <h2 className='text-4xl lg:text-5xl font-bold leading-tight text-center lg:text-start'>
                Interested in working with me?
              </h2>
            </div>
            <div className='flex justify-center lg:justify-end'>
              <Link href='/contact'>
                <Button
                  variant='secondary'
                  size='lg'
                  className='bg-white text-black hover:bg-beige transition-all font-sans font-medium px-8 py-3 text-base'
                >
                  CONTACT ME
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
      <hr className='w-full bg-gray-200 my-14' />
    </section>
  )
}
