import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/utils/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: { name: true, image: true },
        },
      }
    })
    // console.log(posts)
    return NextResponse.json({ posts, status: 200 })
  } catch (err) {
    console.log(err)
    // return new NextResponse(
    //   JSON.stringify({ message: 'Something went wrong', status: 500 })
    // )
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
