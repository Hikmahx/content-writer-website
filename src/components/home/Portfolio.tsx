'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

const portfolioItems = [
  {
    title: "Asa's Comeback: A Display of Versatility in The Music Industry",
    description:
      'When Asa made a comeback and released her new album, V, different reactions were swarming on t...',
    href: 'https://issuu.com/articles/90822555',
  },
  {
    title: "The Wastepreneurs: Africa's Creativity in Upcycling and Recycling",
    description:
      'You are unwinding after a long day at work, and you decide to watch the news, or you probably pick...',
    href: 'https://issuu.com/sarahsportfolio/docs/wastepreneurs_.docx/s/90847018',
  },
  {
    title:
      'Seaming a Broken Fabric: Do Muslim Women Need Male Validation to Feel Worthy in Themselves?',
    description:
      'In this instalment, Sarah Yousuph poses a thought-provoking question: Do Muslim Women Need Ma...',
    href: 'https://themuslimwomentimes.com/2021/01/05/seaming-a-broken-fabric-do-muslim-women-need-male-validation-to-feel-worthy-in-themselves/',
  },
  {
    title:
      "In Pursuit of Purpose and Passion: Ajarat's Journey to Fashion Design Via Stops at Farming And Journalism",
    description:
      'When Asa made a comeback and released her new album, V, different reactions were swarming on t...',
    href: 'https://kloutbox.com/in-pursuit-of-purpose-and-passion-ajarats-journey-to-fashion-design-via-stops-at-farming-and-journalism/',
  },
  {
    title:
      "From Studying Microbiology to Software Engineering; the Inside Story of Nabeelah's Career Transition",
    description:
      'Nabeelah Yousuph, a full-stack Software Engineer, talks about her career transition journey as a lady...',
    href: 'https://kloutbox.com/from-studying-microbiology-to-software-engineering-the-inside-story-of-nabeelahs-career-transition/',
  },
]

export function Portfolio() {
  return (
    <section className='bg-[#3A3C43] text-white py-20 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        <h2 className='font-serif text-4xl md:text-5xl text-center mb-16 text-balance'>
          My Works
        </h2>

        <div className='space-y-8 mb-12'>
          {portfolioItems.map((item, index) => (
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
              className='group block border-b border-gray-600 pb-8 last:border-b-0 hover:border-gray-500 transition-colors duration-300'
            >
              <Link href={item.href} target='_blank' rel='noopener noreferrer'>
                <div className='flex items-start justify-between gap-4'>
                  <div className='flex-1'>
                    <h3 className='font-serif text-xl md:text-2xl mb-3 group-hover:text-beige transition-colors duration-300 text-pretty'>
                      {item.title}
                    </h3>
                    <p className='font-sans text-gray-400 text-base md:text-lg leading-relaxed group-hover:text-gray-300 transition-colors duration-300'>
                      {item.description}
                    </p>
                  </div>
                  <ArrowRight className='w-6 h-6 md:w-8 md:h-8 text-white group-hover:translate-x-1 group-hover:text-beige transition-transform duration-300 flex-shrink-0 mt-1' />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

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
      </div>
    </section>
  )
}
