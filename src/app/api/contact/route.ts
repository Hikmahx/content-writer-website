import { sendMail } from '@/services/mail'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    await sendMail({
      to: process.env.ADMIN_EMAIL!,
      subject: 'New Contact Form Submission',
      template: 'contact', // emails/views/contact.hbs
      context: body,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Email error:', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
