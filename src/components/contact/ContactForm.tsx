'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

const contactFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(8, 'Phone number is too short'),
  message: z.string().min(5, 'Message must be at least 5 characters'),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

export default function ContactForm() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      message: '',
    },
  })

  const onSubmit = (values: ContactFormValues) => {
    console.log('Form submitted:', values)
    toast.message('Message Sent', {
      description: "Thanks for reaching out! I'll get back to you soon.",
    })
  }

  return (
    <div className='min-h-50vh flex max-w-3xl shadow-md mx-auto my-8 rounded-lg overflow-hidden bg-white'>
      <div className='flex-1 flex items-center justify-center p-8'>
        <div className='w-full max-w-2xl'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <FormField
                  control={form.control}
                  name='firstName'
                  render={({ field }) => (
                    <FormItem className='relative'>
                      <FormControl>
                        <Input
                          className='border-transparent border-b border-b-gray-500 shadow-none rounded-none peer block w-full border bg-transparent px-2.5 pt-4 pb-2 text-sm text-gray-900 focus:border-b-gray-700 focus:outline-none focus-visible:ring-0'
                          placeholder=' '
                          {...field}
                        />
                      </FormControl>
                      <FormLabel className='absolute left-2.5 top-10 text-gray-500 text-sm transition-all peer-placeholder-shown:-top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:text-sm peer-focus:text-beige peer-[&:not(:placeholder-shown)]:-top-4 peer-[&:not(:placeholder-shown)]:text-xs'>
                        First Name
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='lastName'
                  render={({ field }) => (
                    <FormItem className='relative'>
                      <FormControl>
                        <Input
                          className='border-transparent border-b border-b-gray-500 shadow-none rounded-none peer block w-full border bg-transparent px-2.5 pt-4 pb-2 text-sm text-gray-900 focus:border-b-gray-700 focus:outline-none focus-visible:ring-0'
                          placeholder=' '
                          {...field}
                        />
                      </FormControl>
                      <FormLabel className='absolute left-2.5 top-10 text-gray-500 text-sm transition-all peer-placeholder-shown:-top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:text-sm peer-focus:text-beige peer-[&:not(:placeholder-shown)]:-top-4 peer-[&:not(:placeholder-shown)]:text-xs'>
                        Last Name
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='w-full'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem className='relative'>
                      <FormControl>
                        <Input
                          type='email'
                          className='border-transparent border-b border-b-gray-500 shadow-none rounded-none peer block w-full border bg-transparent px-2.5 pt-4 pb-2 text-sm text-gray-900 focus:border-b-gray-700 focus:outline-none focus-visible:ring-0'
                          placeholder=' '
                          {...field}
                        />
                      </FormControl>
                      <FormLabel className='absolute left-2.5 top-10 text-gray-500 text-sm transition-all peer-placeholder-shown:-top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:text-sm peer-focus:text-beige peer-[&:not(:placeholder-shown)]:-top-4 peer-[&:not(:placeholder-shown)]:text-xs'>
                        Email
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='message'
                render={({ field }) => (
                  <FormItem className='relative'>
                    <FormControl>
                      <Textarea
                        rows={6}
                        placeholder=' '
                        className='peer border-transparent border-b border-b-gray-500 shadow-none rounded-none peer block w-full border bg-transparent px-2.5 pt-4 pb-2 text-sm text-gray-900 focus:border-b-gray-700 focus:outline-none focus-visible:ring-0  placeholder-transparent'
                        {...field}
                      />
                    </FormControl>
                    <FormLabel className='absolute left-2.5 top-10 text-gray-500 text-sm transition-all peer-placeholder-shown:-top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:text-sm peer-focus:text-beige peer-[&:not(:placeholder-shown)]:-top-4 peer-[&:not(:placeholder-shown)]:text-xs'>
                      Message
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex justify-center pt-8'>
                <Button
                  type='submit'
                  className='ml-auto uppercase bg-black text-white hover:bg-beige hover:text-black px-6 font-sans w-fit mt-8 transition-all duration-300 ease-in-out transform'
                >
                  Send Message
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>

      <div className='hidden lg:block w-80 bg-beige' />
    </div>
  )
}
