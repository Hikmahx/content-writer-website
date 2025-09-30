// src/services/mail/index.ts
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import handlebars from 'handlebars'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PASSWORD,
  },
})

const partialsDir = path.resolve('./src/services/mail/templates/partials')
fs.readdirSync(partialsDir).forEach((file) => {
  const match = file.match(/(.+)\.hbs$/)
  if (match) {
    const name = match[1]
    const filepath = path.join(partialsDir, file)
    const source = fs.readFileSync(filepath, 'utf8')
    handlebars.registerPartial(name, source)
  }
})

export const sendMail = async ({
  to,
  subject,
  template,
  context,
}: {
  to: string
  subject: string
  template: string // .hbs file inside templates/views
  context: object // variables to inject
}) => {
  try {
    const filePath = path.resolve(
      `./src/services/mail/templates/views/${template}.hbs`
    )
    const source = fs.readFileSync(filePath, 'utf8')
 
    const compiledTemplate = handlebars.compile(source)
 
    const html = compiledTemplate(context)

    await transporter.sendMail({
      from: `"My Website" <${process.env.ADMIN_EMAIL}>`,
      to,
      subject,
      html, 
    })
  } catch (err) {
    console.error('SendMail error:', err)
    throw err
  }
}
