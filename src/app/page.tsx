import { About } from '@/components/home/About'
import { CTA } from '@/components/home/CTA'
import { Hero } from '@/components/home/Hero'
import { MyWork } from '@/components/home/MyWork'
import { Services } from '@/components/home/Services'
import { prisma } from '@/lib/prisma'
import { portfolioItems } from '@/data/portfolioData'
import type { WorkItem } from '@/lib/types'

const MY_WORK_COUNT = 5

async function getBio() {
  try {
    const profile = await prisma.adminProfile.findFirst()
    return profile?.bio || null
  } catch (err) {
    console.error('Failed to load bio for homepage:', err)
    return null
  }
}

async function getMyWorkItems(): Promise<WorkItem[]> {
  let posts: { title: string; description: string; slug: string }[] = []

  try {
    posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: MY_WORK_COUNT,
      select: { title: true, description: true, slug: true },
    })
  } catch (err) {
    console.error('Failed to load recent posts for homepage:', err)
  }

  const postItems: WorkItem[] = posts.map((post) => ({
    title: post.title,
    description: post.description,
    href: `/blog/${post.slug}`,
    external: false,
  }))

  // Not enough published posts yet - top up with the static portfolio
  // list so the section always shows a full set.
  const remaining = MY_WORK_COUNT - postItems.length
  const fallbackItems: WorkItem[] =
    remaining > 0
      ? portfolioItems.slice(0, remaining).map((item) => ({
          title: item.title,
          description: item.description,
          href: item.href,
          external: true,
        }))
      : []

  return [...postItems, ...fallbackItems]
}

export default async function HomePage() {
  const [bio, workItems] = await Promise.all([getBio(), getMyWorkItems()])

  return (
    <>
      <Hero />
      <About bio={bio} />
      <MyWork items={workItems} />
      <Services />
      <CTA />
    </>
  )
}
