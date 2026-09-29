import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/utils/auth'
import { extractResumeText, parseResumeText } from '@/lib/resumeParse'

const MAX_FILE_SIZE = 8 * 1024 * 1024 // 8MB

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'No file was uploaded' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File is too large. Please upload a resume under 8MB.' },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    let text: string
    try {
      text = await extractResumeText(buffer, file.name, file.type)
    } catch (err: any) {
      return NextResponse.json(
        { error: err.message || 'Could not read this file' },
        { status: 400 }
      )
    }

    if (!text || !text.trim()) {
      return NextResponse.json(
        {
          error:
            "Couldn't find any readable text in that file. If it's a scanned image, try a text-based PDF or DOCX instead.",
        },
        { status: 422 }
      )
    }

    const parsed = await parseResumeText(text)

    return NextResponse.json(parsed, { status: 200 })
  } catch (err: any) {
    if (err.message === 'Admin access required') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (err.message === 'Groq API key is not configured') {
      return NextResponse.json(
        { error: 'Resume parsing is not configured on this server' },
        { status: 500 }
      )
    }

    console.error('Failed to parse resume:', err)
    return NextResponse.json(
      { error: 'Failed to parse resume' },
      { status: 500 }
    )
  }
}
