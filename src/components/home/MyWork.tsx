'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import type { WorkItem } from '@/lib/types'

interface MyWorkProps {
  items: WorkItem[]
}

export function MyWork({ items }: MyWorkProps) {
  return (
    <section className='py-20 px-4 sm:px-6 lg:px-8 bg-[#3A3C43] text-white'>
      <div className='max-w-7xl mx-auto'>
        <h2 className='font-serif text-4xl md:text-5xl text-center mb-16'>
          My Works
        </h2>

        <div className='space-y-8 mb-12'>
          {items.map((item, index) => (
            <motion.div
              key={item.href}
              custom={index}
              initial={{ opacity: 0, x: '-50%' }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.25,
                duration: 0.7,
                type: 'spring',
              }}
              className='group block border-b pb-8 last:border-b-0 transition-colors duration-300 border-gray-600 hover:border-gray-500'
            >
              <Link
                href={item.href}
                {...(item.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                <div className='flex items-start justify-between gap-4'>
                  <div className='flex-1'>
                    <h3 className='font-serif text-xl md:text-2xl mb-3 transition-colors duration-300 text-pretty group-hover:text-beige'>
                      {item.title}
                    </h3>
                    <p className='font-sans text-base md:text-lg leading-relaxed transition-colors duration-300 text-gray-400 group-hover:text-gray-300'>
                      {item.description}
                    </p>
                  </div>
                  <ArrowRight className='w-6 h-6 md:w-8 md:h-8 flex-shrink-0 mt-1 transition-transform duration-300 group-hover:text-beige text-white group-hover:translate-x-1' />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className='text-center'>
          <Link href='/blog'>
            <Button
              size='lg'
              className='bg-white text-gray-800 hover:bg-beige transition-all font-sans font-medium px-8 py-3 text-base'
            >
              VIEW MORE
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
