import { About } from '@/components/home/About'
import { CTA } from '@/components/home/CTA'
import { Hero } from '@/components/home/Hero'
import { Services } from '@/components/home/Services'

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <CTA />
    </>
  )
}
