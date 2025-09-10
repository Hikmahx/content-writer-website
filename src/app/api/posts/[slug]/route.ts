import { prisma } from '@/lib/prisma'
import { getCurrentUser, requireAdmin } from '@/lib/utils/auth'
import { validateSlugUniqueness } from '@/lib/utils/post'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const user = await getCurrentUser()

    const isAdmin = user?.role === 'ADMIN'

    const post = await prisma.post.findUnique({
      // No access to draft post if the user is not an admin
      where: isAdmin ? { slug } : { slug, published: true },
      include: {
        author: {
          select: { name: true, image: true },
        },
        _count: {
          select: { comments: true, likes: true },
        },
      },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAdmin()
    const { slug: currentSlug } = await params
    const body = await request.json()

    const currentPost = await prisma.post.findUnique({
      where: { slug: currentSlug },
    })

    if (!currentPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // // Check if user is the author OR an admin
    // if (currentPost.authorId !== user.id) {
    //   return NextResponse.json(
    //     { error: 'You can only update your own posts' },
    //     { status: 403 }
    //   )
    // }

    // Validate slug uniqueness (only if slug is being changed)
    if (body.slug && body.slug !== currentSlug) {
      await validateSlugUniqueness(body.slug, currentPost.id)
    }

    const { title, slug, description, content, img, hashtags, published } = body

    const updatedPost = await prisma.post.update({
      where: { slug: currentSlug },
      data: {
        title,
        slug,
        description,
        content,
        img,
        hashtags,
        published, // Keep the original author (don't allow changing ownership)
        authorId: currentPost.authorId,
      },
      include: {
        author: {
          select: { name: true, image: true },
        },
      },
    })

    return NextResponse.json(updatedPost)
  } catch (err: any) {
    if (err.message === 'Title should be unique always') {
      console.log(err.message)
      return NextResponse.json({ error: err.message }, { status: 409 })
    }
    if (err.message === 'Admin access required') {
      console.log(err.message)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.error('Failed to update post:', err.message)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}
