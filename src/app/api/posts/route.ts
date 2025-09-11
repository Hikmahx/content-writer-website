import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/utils/auth'
import { validateSlugUniqueness } from '@/lib/utils/post'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const sortBy = searchParams.get('sortBy') || 'date'
  const searchTerm = searchParams.get('search') || ''
  const published = searchParams.get('published') || 'true'

  const itemsPerPage = parseInt(searchParams.get('itemsPerPage') || '10')
  const orderBy =
    sortBy === 'title'
      ? { title: 'asc' as const }
      : { createdAt: 'desc' as const }
  const publishedBool = published === 'true'

  const query = {
    take: itemsPerPage,
    skip: itemsPerPage * (page - 1),
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
    return NextResponse.json({
      posts,
      totalCount: count,
      currentPage: page,
      totalPages: Math.ceil(count / itemsPerPage),
    })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: 'Something went wrong', status: 500 })
  }
}

// CREATE NEW POST
export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin()
    const body = await request.json()

    await validateSlugUniqueness(body.slug)

    const newPost = await prisma.post.create({
      data: {
        ...body,
        published: body.published || false,
        authorId: user.id,
        slug: body.slug,
      },
      include: {
        author: {
          select: { name: true, image: true },
        },
      },
    })

    return NextResponse.json(newPost, { status: 201 })
  } catch (err: any) {
    if (err.message === 'Title should be unique always') {
      console.log(err.message)
      return NextResponse.json({ error: err.message }, { status: 409 })
    }
    if (err.message === 'Authentication required') {
      console.log(err.message)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.error('Failed to create post:', err.message)
    return NextResponse.json({ err: 'Failed to create post' }, { status: 500 })
  }
}
