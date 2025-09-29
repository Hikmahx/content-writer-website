import ContactForm from '@/components/contact/ContactForm'
import React from 'react'

export default function ContactPage() {
  return (
    <div className='min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] to-white from-gray-100'>
      <div className='text-center mb-12'>
        <h1 className='text-5xl font-serif mb-4'>Contact</h1>
        <p className='text-gray-600 text-lg'>
          Any question or remarks? Just write me a message!
        </p>
      </div>
      <ContactForm />
    </div>
  )
}
