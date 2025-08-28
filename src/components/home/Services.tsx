import Image from 'next/image'

export function Services() {
  const services = [
    {
      icon: '/content-writing.svg',
      title: 'Content Writing',
      description:
        'I turn ideas into words that connect and engage. My writing blends clarity with emotion to make every message memorable. Each piece is crafted to reach the right audience.',
    },
    {
      icon: '/storytelling.svg',
      title: 'Storytelling',
      description:
        'Stories are bridges between people and ideas. I create narratives that spark emotion and leave a lasting impression. Every story is shaped to inspire, inform, and truly connect.',
    },
    {
      icon: '/creative-strategy.svg',
      title: 'Creative Strategy',
      description:
        'Great content begins with vision and direction. I shape ideas into clear strategies that keep goals in focus. Each plan ensures your message is purposeful, impactful, and consistent.',
    }
  ]

  return (
    <section className='py-40 bg-gray-50 relative min-h-screen'>
      <Image
        src='/services-top.svg'
        alt='wavy bg'
        width={224}
        height={310}
        className='absolute top-0 right-0'
      />
      <Image
        src='/services-bottom.svg'
        alt='wavy bg'
        width={128}
        height={505}
        className='absolute bottom-0 left-0'
      />

      <div className='relative z-10 max-w-7xl mx-auto px-6 lg:px-12'>
        <h2 className='text-4xl font-bold font-serif text-center text-foreground mb-16'>
          Services
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
          {services.map((service, index) => (
            <div key={index} className='text-center'>
              <div className='flex justify-center mb-8'>
                <Image
                  src={service.icon}
                  alt={service.title}
                  width={140}
                  height={136}
                  className='w-full h-[100px] text-gray-600 bg-cover'
                />
              </div>
              <h3 className='text-xl font-semibold text-foreground mb-4'>
                {service.title}
              </h3>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
