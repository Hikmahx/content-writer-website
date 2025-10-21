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
  const category = searchParams.get('category') || 'all'
  const itemsPerPage = parseInt(searchParams.get('itemsPerPage') || '10')

  const orderBy =
    sortBy === 'title'
      ? { title: 'asc' as const }
      : { createdAt: 'desc' as const }

  const publishedBool = published === 'true'

  const where: any = {
    published: publishedBool,
    OR: [
      { title: { contains: searchTerm, mode: 'insensitive' as const } },
      { content: { contains: searchTerm, mode: 'insensitive' as const } },
      { description: { contains: searchTerm, mode: 'insensitive' as const } },
    ],
  }

  if (category !== 'all' && category.trim() !== '') {
    where.catId = category
  }

  try {
    const [posts, count, categories] = await prisma.$transaction([
      prisma.post.findMany({
        take: itemsPerPage,
        skip: itemsPerPage * (page - 1),
        orderBy,
        where,
        include: {
          author: {
            select: { name: true, image: true },
          },
          category: { select: { title: true } },
        },
      }),
      prisma.post.count({ where }),
      prisma.category.findMany({
        select: { id: true, title: true },
      }),
    ])

    const formattedPosts = posts.map((post) => ({
      ...post,
      category: post.category?.title || null,
    }))

    return NextResponse.json(
      {
        posts: formattedPosts,
        totalCount: count,
        currentPage: page,
        totalPages: Math.ceil(count / itemsPerPage),
        categories,
      },
      { status: 200 }
    )
  } catch (err) {
    console.log(err)
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

// CREATE NEW POST
export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin()
    const body = await request.json()
    const { category, ...rest } = body

    await validateSlugUniqueness(body.slug)

    const newPost = await prisma.post.create({
      data: {
        ...rest,
        catId: category,
        published: body.published || false,
        authorId: user.id,
        slug: body.slug,
      },
      include: {
        author: {
          select: { name: true, image: true },
        },
        category: { select: { title: true } },
      },
    })

    const formattedPost = {
      ...newPost,
      category: newPost.category?.title || null,
    }

    return NextResponse.json(formattedPost, { status: 201 })
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
