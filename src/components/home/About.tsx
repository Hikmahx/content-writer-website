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
      <div className='max-w-7xl mx-auto py-20 px-6 lg:px-12 relative'>
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
              <p className='text-base text-gray-600 leading-[1.8]'>
                I’m a professional content writer with a passion for
                transforming ideas into compelling narratives that resonate.
                Over the years, I’ve collaborated with brands and individuals
                across industries to craft
                <span className='font-bold'> blog articles</span>,
                <span className='font-bold'> website copy</span>, and
                <span className='font-bold'> brand stories</span> that build
                trust and inspire action.
              </p>

              <p className='text-base text-gray-600 leading-[1.8] mt-4'>
                I specialize in{' '}
                <span className='font-bold'>SEO-driven content strategies</span>{' '}
                that boost visibility and engagement. My approach blends
                <span className='font-bold'> creativity</span>,
                <span className='font-bold'> clarity</span>, and
                <span className='font-bold'> rigorous research</span> to deliver
                on-brand, on-time content that aligns with your voice and
                goals—driving
                <span className='font-bold'> readability</span>,
                <span className='font-bold'> rankings</span>, and a stronger
                connection with your audience.
              </p>
            </div>
            <Link href='/about'>
              <Button className='bg-black text-white cursor-pointer hover:text-black hover:bg-transparent hover:border hover:border-black transition px-8 py-3 text-base'>
                More Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
