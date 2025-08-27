import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

export function About() {
  return (
    <section className='bg-white relative w-full h-full py-8 lg:py-16 text-center lg:text-start'>
      <Image
        src='/about-bg.png'
        alt='intro background'
        className='absolute inset-0 w-[100%] h-[100%] opacity-30'
        width={1000}
        height={1000}
      />
      <div className='max-w-7xl mx-auto py-20 px-6 lg:px-12'>
        <div className='grid lg:grid-cols-2 gap-16 items-center'>
          <div className='relative flex justify-center lg:justify-start'>
            <div className='relative'>
              <Image
                src='/about-img.svg'
                alt='Sarah Yousuph smiling'
                width={256}
                height={256}
                className='w-3/5 mx-auto lg:w-full h-full object-cover'
              />

              <div className='absolute -top-4 -right-4 w-20 h-20 bg-gray-200 rounded-full'></div>
            </div>
          </div>

          <div className='flex flex-col space-y-6'>
            <div className='flex flex-col space-y-4'>
              <h2
                className='text-4xl font-bold text-foreground font-serif
            '
              >
                A bit about me
              </h2>
              <p className='text-base text-muted-foreground leading-relaxed'>
                I'm a content writer with a passion for turning ideas into words
                that resonate. Over the years, I've worked with brands and
                individuals to create content that blends clarity, creativity,
                and strategy. Whether it's blog articles, website copy, or brand
                storytelling, I focus on writing that builds trust, sparks
                connection, and inspires action.
              </p>
            </div>
            <Link href='/about'>
              <Button
                variant='outline'
                className='cursor-pointer border-black text-black hover:bg-black hover:text-white px-6 bg-transparent'
              >
                More Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
