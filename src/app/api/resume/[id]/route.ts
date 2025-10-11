import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/utils/auth'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const type = req.nextUrl.searchParams.get('type')

    switch (type) {
      case 'experience': {
        const experience = await prisma.experience.findUnique({ where: { id } })
        if (!experience)
          return NextResponse.json(
            { error: 'Experience data not found' },
            { status: 404 }
          )
        return NextResponse.json({ experience })
      }

      case 'education': {
        const education = await prisma.education.findUnique({ where: { id } })
        if (!education)
          return NextResponse.json(
            { error: 'Education data not found' },
            { status: 404 }
          )
        return NextResponse.json({ education })
      }

      case 'personalInfo': {
        const personalInfo = await prisma.personalInfo.findUnique({
          where: { id },
        })
        if (!personalInfo)
          return NextResponse.json(
            { error: 'Personal Info data not found' },
            { status: 404 }
          )
        return NextResponse.json({ personalInfo })
      }

      default:
        return NextResponse.json(
          { error: 'Type not provided' },
          { status: 400 }
        )
    }
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = await req.json()
    const { type, id: _id, ...data } = body

    switch (type) {
      case 'experience': {
        const currentExperience = await prisma.experience.findUnique({
          where: { id },
        })

        if (!currentExperience) {
          return NextResponse.json(
            { error: 'Experience data not found' },
            { status: 404 }
          )
        }

        const experience = await prisma.experience.update({
          where: { id },
          data,
        })

        return NextResponse.json({ experience })
      }

      case 'education': {
        const currentEducation = await prisma.education.findUnique({
          where: { id },
        })

        if (!currentEducation) {
          return NextResponse.json(
            { error: 'Education data not found' },
            { status: 404 }
          )
        }

        const education = await prisma.education.update({
          where: { id },
          data,
        })
        return NextResponse.json({ education })
      }

      case 'personalInfo': {
        const existingInfo = await prisma.personalInfo.findUnique({
          where: { id },
        })

        if (!existingInfo) {
          return NextResponse.json(
            { error: 'Personal Info data not found' },
            { status: 404 }
          )
        }

        const personalInfo = await prisma.personalInfo.update({
          where: { id },
          data,
        })
        return NextResponse.json({ personalInfo })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid type provided' },
          { status: 400 }
        )
    }
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to update data' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const type = req.nextUrl.searchParams.get('type')

    switch (type) {
      case 'experience': {
        const currentExperience = await prisma.experience.findUnique({
          where: { id },
        })

        if (!currentExperience) {
          return NextResponse.json(
            { error: 'Experience data not found' },
            { status: 404 }
          )
        }

        await prisma.experience.delete({
          where: { id },
        })

        return NextResponse.json({
          message: 'Experience data successfully deleted',
        })
      }

      case 'education': {
        const currentEducation = await prisma.education.findUnique({
          where: { id },
        })

        if (!currentEducation) {
          return NextResponse.json(
            { error: 'Education data not found' },
            { status: 404 }
          )
        }

        await prisma.education.delete({
          where: { id },
        })

        return NextResponse.json({
          message: 'Education data successfully deleted',
        })
      }

      case 'personalInfo': {
        const existingInfo = await prisma.personalInfo.findUnique({
          where: { id },
        })

        if (!existingInfo) {
          return NextResponse.json(
            { error: 'Personal Info data not found' },
            { status: 404 }
          )
        }

        await prisma.personalInfo.delete({
          where: { id },
        })

        return NextResponse.json({
          message: 'personal info successfully deleted',
        })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid type provided' },
          { status: 400 }
        )
    }
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to delete data' },
      { status: 500 }
    )
  }
}
