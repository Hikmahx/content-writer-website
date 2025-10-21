import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const GET = async () => {
  try {
    const categories = await prisma.category.findMany({
      select: { id: true, title: true },
      orderBy: { title: 'asc' },
    })
    return NextResponse.json(categories, { status: 200 })
  } catch (err) {
    console.log(err)
    return NextResponse.json(
      { message: 'Something went wrong!' },
      { status: 500 }
    )
  }
}

export const POST = async (request: Request) => {
  try {
    const { title } = await request.json()

    if (!title) {
      return NextResponse.json(
        { message: 'Category Title is required' },
        { status: 400 }
      )
    }

    const newCategory = await prisma.category.create({
      data: { title },
    })

    return NextResponse.json(newCategory, { status: 201 })
  } catch (err: any) {
    console.log(err)
    if (err.code === 'P2002') {
      return NextResponse.json(
        { message: 'Category already exists' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { message: 'Something went wrong!' },
      { status: 500 }
    )
  }
}
