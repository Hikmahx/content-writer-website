import { About } from '@/components/home/About'
import { CTA } from '@/components/home/CTA'
import { Hero } from '@/components/home/Hero'
import { Portfolio } from '@/components/home/Portfolio'
import { Services } from '@/components/home/Services'
import { prisma } from '@/lib/prisma'

async function getBio() {
  try {
    const profile = await prisma.adminProfile.findFirst()
    return profile?.bio || null
  } catch (err) {
    console.error('Failed to load bio for homepage:', err)
    return null
  }
}

export default async function HomePage() {
  const bio = await getBio()

  return (
    <>
      <Hero />
      <About bio={bio} />
      <Portfolio />
      <Services />
      <CTA />
    </>
  )
}
