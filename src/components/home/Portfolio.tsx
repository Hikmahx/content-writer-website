'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { portfolioItems } from '@/data/portfolioData'

interface PortfolioProps {
  variant?: 'home' | 'page'
}

export function Portfolio({ variant = 'home' }: PortfolioProps) {
  const itemsToShow =
    variant === 'home' ? portfolioItems.slice(0, 5) : portfolioItems

  return (
    <section
      className={`py-20 px-4 sm:px-6 lg:px-8 ${
        variant === 'home'
          ? 'bg-[#3A3C43] text-white'
          : 'bg-white text-gray-900'
      }`}
    >
      <div className='max-w-7xl mx-auto'>
        {variant === 'home' ? (
          <h2 className='font-serif text-4xl md:text-5xl text-center mb-16'>
            My Works
          </h2>
        ) : (
          <div className='text-center mb-16'>
            <h1 className='font-serif text-5xl md:text-6xl mb-4'>
              My Portfolio
            </h1>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              A collection of my articles and published works across different
              platforms.
            </p>
          </div>
        )}

        <div className='space-y-8 mb-12'>
          {itemsToShow.map((item, index) => (
            <motion.div
              key={index}
              custom={index}
              initial={{ opacity: 0, x: '-50%' }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.25,
                duration: 0.7,
                type: 'spring',
              }}
              className={`group block border-b pb-8 last:border-b-0 transition-colors duration-300 ${
                variant === 'home'
                  ? 'border-gray-600 hover:border-gray-500'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <Link href={item.href} target='_blank' rel='noopener noreferrer'>
                <div className='flex items-start justify-between gap-4'>
                  <div className='flex-1'>
                    <h3 className='font-serif text-xl md:text-2xl mb-3 transition-colors duration-300 text-pretty group-hover:text-beige'>
                      {item.title}
                    </h3>
                    <p
                      className={`font-sans text-base md:text-lg leading-relaxed transition-colors duration-300 ${
                        variant === 'home'
                          ? 'text-gray-400 group-hover:text-gray-300'
                          : 'text-gray-600 group-hover:text-gray-800'
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                  <ArrowRight
                    className={`w-6 h-6 md:w-8 md:h-8 flex-shrink-0 mt-1 transition-transform duration-300 group-hover:text-beige ${
                      variant === 'home'
                        ? 'text-white group-hover:translate-x-1'
                        : 'text-gray-600 group-hover:translate-x-1'
                    }`}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {variant === 'home' && (
          <div className='text-center'>
            <Link href='/portfolio'>
              <Button
                size='lg'
                className='bg-white text-gray-800 hover:bg-beige transition-all font-sans font-medium px-8 py-3 text-base'
              >
                VIEW MORE
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
