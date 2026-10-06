import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/utils/auth'
import { removeDuplicateEducation, removeDuplicateExperiences } from '@/lib/resumeDuplicates'

const MAX_EDUCATION = 5

// Replaces ALL of the admin's saved experience (or education) with the
// submitted entries in one transaction. Called only when the user clicks
// Save after an uploaded resume has pre-filled the form.
export async function POST(req: NextRequest) {
  try {
    const user = await requireAdmin()
    const { type, entries } = await req.json()

    if (!Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json(
        { error: 'At least one entry is required' },
        { status: 400 }
      )
    }

    switch (type) {
      case 'experience': {
        const unique = removeDuplicateExperiences(entries)
        const data = unique.map((e: any) => ({
          organization: String(e.organization || '').trim(),
          position: String(e.position || '').trim(),
          location: String(e.location || ''),
          startDate: new Date(e.startDate),
          endDate: e.endDate ? new Date(e.endDate) : null,
          responsibilities: Array.isArray(e.responsibilities)
            ? e.responsibilities.filter(Boolean)
            : [],
          userId: user.id,
        }))

        if (data.some((e) => !e.organization || !e.position || isNaN(e.startDate.getTime()))) {
          return NextResponse.json(
            { error: 'Each experience needs an organization, position and valid start date' },
            { status: 400 }
          )
        }

        await prisma.$transaction([
          prisma.experience.deleteMany({ where: { userId: user.id } }),
          prisma.experience.createMany({ data }),
        ])
        return NextResponse.json({ count: data.length }, { status: 201 })
      }

      case 'education': {
        const unique = removeDuplicateEducation(entries)
        if (unique.length > MAX_EDUCATION) {
          return NextResponse.json(
            { error: `You can't have more than ${MAX_EDUCATION} educations` },
            { status: 400 }
          )
        }
        const data = unique.map((e: any) => ({
          institution: String(e.institution || '').trim(),
          degree: e.degree || null,
          major: String(e.major || '').trim(),
          location: String(e.location || ''),
          gpa: e.gpa || null,
          graduationDate: new Date(e.graduationDate),
          userId: user.id,
        }))

        if (data.some((e) => !e.institution || !e.major || isNaN(e.graduationDate.getTime()))) {
          return NextResponse.json(
            { error: 'Each education needs an institution, major and valid graduation date' },
            { status: 400 }
          )
        }

        await prisma.$transaction([
          prisma.education.deleteMany({ where: { userId: user.id } }),
          prisma.education.createMany({ data }),
        ])
        return NextResponse.json({ count: data.length }, { status: 201 })
      }

      default:
        return NextResponse.json({ error: 'Invalid type provided' }, { status: 400 })
    }
  } catch (err: any) {
    if (err?.message === 'Admin access required') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error(err)
    return NextResponse.json({ error: 'Failed to import resume data' }, { status: 500 })
  }
}
