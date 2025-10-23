'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function Hero() {
  return (
    <section className='relative xl:max-h-[80vh] overflow-hidden flex flex-col-reverse md:flex-col md:grid md:grid-cols-2 2xl:max-w-7xl mx-auto md:items-center mb-12 md:mb-0'>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className='relative z-10 max-w-7xl mx-auto px-6 lg:pr-12 lg:pl-0 lg:py-20 xl:py-28 -mt-32'
      >
        <div className='flex flex-col lg:px-10 xl:pl-12 2xl:pl-0 space-y-6 text-center md:text-left sm:bg-white mt-4 sm:mt-8 xl:-mt-20'>
          <div className='flex flex-col space-y-4'>
            <p className='text-lg'>Hello, I'm</p>
            <div>
              <h1 className='text-5xl lg:text-6xl font-medium font-serif text-foreground tracking-wider mb-3'>
                SARAH YOUSUPH
              </h1>
              <p className='text-xl'>Professional Content Writer</p>
            </div>
            <p className='text-sm lg:text-base text-muted-foreground max-w-md lg:max-w-lg leading-relaxed'>
              I help brands and individuals turn their ideas into compelling
              narratives. I focus on maintaining clarity and emotional impact in
              blog posts, website copy, ghostwritten pieces and brand
              storytelling.
            </p>
          </div>
          <Link href='/contact'>
            <Button className='bg-black text-white cursor-pointer hover:text-black hover:bg-beige transition-all px-8 py-3 text-base'>
              LET'S TALK
            </Button>
          </Link>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Image
          src='/hero-img.svg'
          alt='Sarah Yousuph'
          width={320}
          height={320}
          className='w-[600px] h-[400px] md:h-[500px] lg:h-[640px] xl:h-[750px] object-cover object-[14px_0] sm:object-[80px_0] md:object-left lg:z-10 mt-8 md:mt-0 relative xl:relative bottom-20 lg:bottom-auto lg:top-[-15%] xl:top-[-12%] right-[-20%] md:right-[-18%]'
          priority
          fetchPriority='high'
        />
      </motion.div>
      <div>
        <Image
          src='/hero-bottom.svg'
          alt='hero bottom icon'
          width={253}
          height={200}
          className='absolute bottom-0 left-0 hidden lg:block'
        />
      </div>
    </section>
  )
}
