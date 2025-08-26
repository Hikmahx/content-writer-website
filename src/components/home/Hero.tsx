import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export function Hero() {
  return (
    <section className='relative lg:h-[75vh] overflow-hidden flex flex-col md:!grid grid-cols-2 2xl:max-w-7xl mx-auto'>
      {/* Decorative shapes */}
      {/* <div className='absolute top-20 right-0 w-64 h-64 bg-gray-800 rounded-full transform translate-x-32'></div>
      <div className='absolute bottom-0 left-0 w-96 h-96 bg-gray-200 rounded-full transform -translate-x-48 translate-y-48'></div>
      <div className='absolute top-1/2 right-1/4 w-4 h-4 bg-gray-400 rounded-full'></div>
      <div className='absolute bottom-1/3 right-1/3 w-32 h-32 border border-gray-300 rounded-full'></div> */}

      <div className='relative z-10 max-w-7xl mx-auto px-6 lg:pr-12 lg:pl-0 lg:py-20'>
        {/* <div className='grid-lg:grid-cols-2 gap-12 items-center'> */}
        <div className='space-y-3 lg:space-y-6 text-center md:!text-left'>
          <p className='text-lg text-muted-foreground'>Hello, I'm</p>
          <h1 className='text-5xl lg:text-6xl font-medium font-serif text-foreground leading-tight'>
            SARAH YOUSUPH
          </h1>
          <p className='text-xl text-muted-foreground'>
            Professional Content Writer
          </p>
          <p className='text-base text-muted-foreground max-w-md lg:max-w-lg leading-relaxed'>
            I help brands and individuals turn their ideas into compelling
            narratives. I focus on maintaining clarity and emotional impact in
            blog posts, website copy, ghostwritten pieces and brand
            storytelling.
          </p>
          <Link href='/contact'>
            <Button className='bg-black text-white cursor-pointer hover:!text-black hover:bg-transparent hover:border hover:border-black transition px-8 py-3 text-base'>
              Let's talk
            </Button>
          </Link>
        </div>

        {/* <div className='relative flex justify-center'>
          <div className='relative'>
            <div className='w-80 h-80 bg-gray-300 rounded-full overflow-hidden'>
            </div>
            <div className='absolute -bottom-4 -left-4 w-16 h-16 border-2 border-gray-400 rounded-full'></div>
          </div>
        </div> */}
      </div>
      {/* </div> */}
      {/* <div className=''> */}
      {/* <div className='w-[700px] h-[700px] bg-[#1e1e20] absolute -top-[17%] -right-[38%] rounded-full'></div> */}
      {/* <div className='w-auto'> */}
      <Image
        src='/hero-img.svg'
        alt='Sarah Yousuph'
        width={320}
        height={320}
        className='w-[750px] h-[400px] md:h-[500px] lg:h-[720px] object-cover object-left z-10 relative lg:absolute 2xl:relative lg:top-[-15%] right-[-20%] md:right-[-18%]'
      />
      {/* <div className='w-[70px] h-[70px] border-2 border-black absolute top-[72%] xlleft-[42.5%] rounded-full'></div> */}
      {/* </div> */}
      {/* <Image
          src='/hero-img-bg.svg'
          alt='Sarah Yousuph'
          width={320}
          height={320}
          className='w-full max-w-[640px] h-full object-cover absolute top-0 right-0'
        /> */}
      {/* </div> */}
    </section>
  )
}
