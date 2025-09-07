'use client'

import { Button } from '@/components/ui/button'
import React from 'react'
import { FcGoogle } from 'react-icons/fc'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function LoginPage() {
  const { data: session, status } = useSession()
  console.log(session, status)

  // if (session) {
  //   return (
  //     <>
  //       Signed in as {session.user.email} <br />
  //       <button onClick={() => signOut()}>Sign out</button>
  //     </>
  //   )
  // }
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
