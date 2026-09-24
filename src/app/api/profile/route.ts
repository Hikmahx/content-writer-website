import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/utils/auth'
import { NextRequest, NextResponse } from 'next/server'

// AdminProfile is a singleton table (one row for the whole site), so we
// always operate on the first record we find and create it lazily the
// first time an admin saves something.
async function getOrCreateProfile() {
  const existing = await prisma.adminProfile.findFirst()
  if (existing) return existing
  return prisma.adminProfile.create({ data: {} })
}

// PUBLIC: used by the home page to render the current bio
export async function GET() {
  try {
    const profile = await prisma.adminProfile.findFirst()
    return NextResponse.json(
      { bio: profile?.bio ?? null },
      { status: 200 }
    )
  } catch (err) {
    console.error('Failed to fetch profile:', err)
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

// ADMIN ONLY: update the bio (rich text HTML from the editor)
export async function PUT(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const bio = typeof body.bio === 'string' ? body.bio : ''

    const current = await getOrCreateProfile()
    const updated = await prisma.adminProfile.update({
      where: { id: current.id },
      data: { bio },
    })

    return NextResponse.json({ bio: updated.bio }, { status: 200 })
  } catch (err: any) {
    if (
      err.message === 'Admin access required' ||
      err.message === 'Authentication required'
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.error('Failed to update profile:', err)
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
