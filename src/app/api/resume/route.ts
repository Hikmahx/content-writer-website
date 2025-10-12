import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/utils/auth'

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany()
    const education = await prisma.education.findMany()
    const personalInfo = await prisma.personalInfo.findMany()

    return NextResponse.json({ experiences, education, personalInfo })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch profile data' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAdmin()
    const body = await req.json()
    const { type, ...data } = body

    switch (type) {
      case 'experience': {
        const experience = await prisma.experience.create({
          data: {
            ...data,
            userId: user.id,
          },
        })
        return NextResponse.json({ experience }, { status: 201 })
      }

      case 'education': {
        const count = await prisma.education.count({
          where: { userId: user.id },
        })

        if (count >= 5) {
          return NextResponse.json(
            { error: "You can't have more than 5 educations" },
            { status: 400 }
          )
        }

        const education = await prisma.education.create({
          data: {
            ...data,
            userId: user.id,
          },
        })
        return NextResponse.json({ education }, { status: 201 })
      }

      case 'personalInfo': {
        const existingInfo = await prisma.personalInfo.findUnique({
          where: { userId: user.id },
        })

        if (existingInfo) {
          return NextResponse.json(
            { error: 'PersonalInfo already exists. Please update instead.' },
            { status: 400 }
          )
        }

        const personalInfo = await prisma.personalInfo.create({
          data: {
            ...data,
            userId: user.id,
          },
        })
        return NextResponse.json({ personalInfo }, { status: 201 })
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
      { error: 'Failed to create entry' },
      { status: 500 }
    )
  }
}
