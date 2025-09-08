'use client'

import { Button } from '@/components/ui/button'
import React from 'react'
import { FcGoogle } from 'react-icons/fc'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function LoginPage() {
  const { data: session, status } = useSession()
  console.log(session, status)

  if (session) {
    return (
      <div className='h-[50vh] flex flex-col gap-4 items-center justify-center'>
        <p>
          Signed in as {session.user.email}
        </p>
        <Button variant='outline' onClick={() => signOut()}>Sign out</Button>
      </div>
    )
  }
  return (
    <div className='h-[50vh] flex items-center justify-center'>
      <Button
        variant='outline'
        size={'lg'}
        className='flex gap-2 mx-auto hover:bg-beige hover:text-black transition-all uppercase'
        onClick={() => signIn('google')}
      >
        <FcGoogle />
        Sign in Google
      </Button>
    </div>
  )
}
