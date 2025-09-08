import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const posts = await prisma.post.findMany()
    return NextResponse.json({ posts, status: 200 })
  } catch (err) {
    console.log(err)
    // return new NextResponse(
    //   JSON.stringify({ message: 'Something went wrong', status: 500 })
    // )
    return NextResponse.json({ message: 'Something went wrong', status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // const { title, content, published } = await request.json()
    // console.log({ title, content, published })
    // return NextResponse.json({ success: true })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: 'Something went wrong', status: 500 })
  }
}
