import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/utils/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const sortBy = searchParams.get('sortBy') || 'date'
  const searchTerm = searchParams.get('search') || ''
  const published = searchParams.get('published') || true

  const POST_PER_PAGE = 2

  const orderBy =
    sortBy === 'title'
      ? { title: 'asc' as const }
      : { createdAt: 'desc' as const }
  const publishedBool = published === 'true'

  const query = {
    take: POST_PER_PAGE,
    skip: POST_PER_PAGE * (page - 1),
    orderBy,
    where: {
      published: publishedBool,
      OR: [
        { title: { contains: searchTerm, mode: 'insensitive' as const } },
        { content: { contains: searchTerm, mode: 'insensitive' as const } },
        { description: { contains: searchTerm, mode: 'insensitive' as const } },
      ],
    },
  }

  try {
    const [posts, count] = await prisma.$transaction([
      prisma.post.findMany({
        ...query,
        include: {
          author: {
            select: { name: true, image: true },
          },
        },
      }),
      prisma.post.count({ where: query.where }),
    ])
    console.log(posts, count)
    return NextResponse.json({ posts, count, status: 200 })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: 'Something went wrong', status: 500 })
  }
}

// CREATE NEW POST
export async function POST(request: NextRequest) {
  const user = await requireAdmin()

  try {
    const body = await request.json()

    const newPost = await prisma.post.create({
      data: { ...body, published: body.published || false, authorId: user.id },
      include: {
        author: {
          select: { name: true, image: true },
        },
      },
    })

    return NextResponse.json(newPost)
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: 'Something went wrong', status: 500 })
  }
}
