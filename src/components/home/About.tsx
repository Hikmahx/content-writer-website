'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export function About() {
  return (
    <section className='bg-white relative text-center lg:text-start py-8 lg:py-16 px-4 sm:px-6 lg:px-8'>
      <div className="absolute inset-0 bg-[url('/about-bg.png')] bg-cover bg-center bg-no-repeat opacity-30"></div>
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        className='max-w-7xl mx-auto py-20 px-6 lg:px-12 relative'
      >
        <div className='flex flex-col lg:flex-row gap-16 items-center'>
          <div className='relative flex justify-center lg:justify-start lg:flex-1'>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className='relative'
            >
              <Image
                src='/about-img.svg'
                alt='Sarah Yousuph smiling'
                width={256}
                height={256}
                className='w-3/5 mx-auto lg:w-full object-cover'
              />

              <div className='absolute -top-4 -right-4 w-20 h-20 bg-gray-200 rounded-full'></div>
            </motion.div>
          </div>

          <div className='lg:flex-[0_0_60%] flex flex-col space-y-6'>
            <div className='space-y-4 max-w-md sm:max-w-2xl lg:max-w-4xl'>
              <h2 className='text-4xl font-bold text-foreground font-serif'>
                A bit about me
              </h2>
              <p className='text-sm lg:text-base text-gray-600 leading-[1.9] lg:leading-relaxed'>
                I’m a professional content writer with a passion for
                transforming ideas into compelling narratives that resonate.
                Over the years, I’ve collaborated with brands and individuals
                across industries to craft
                <span className='text-black font-medium'> blog articles</span>,
                <span className='text-black font-medium'> website copy</span>,
                and
                <span className='text-black font-medium'>
                  {' '}
                  brand stories
                </span>{' '}
                that build trust and inspire action.
              </p>

              <p className='text-sm lg:text-base text-gray-600 leading-[1.9] lg:leading-relaxed mt-4'>
                I specialize in{' '}
                <span className='text-black font-medium'>
                  SEO-driven content strategies
                </span>{' '}
                that boost visibility and engagement. My approach blends
                <span className='text-black font-medium'> creativity</span>,
                <span className='text-black font-medium'> clarity</span>, and
                <span className='text-black font-medium'>
                  {' '}
                  rigorous research
                </span>{' '}
                to deliver on-brand, on-time content that aligns with your voice
                and goals—driving
                <span className='text-black font-medium'> readability</span>,
                <span className='text-black font-medium'> rankings</span>, and a
                stronger connection with your audience.
              </p>
            </div>
            <Link href='/about'>
              <Button className='bg-black text-white cursor-pointer hover:text-black hover:bg-beige transition-all px-8 py-3 text-base'>
                MORE DETAILS
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
