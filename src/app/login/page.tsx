import { Button } from '@/components/ui/button'
import React from 'react'
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  return (
    <div className='h-[50vh] flex items-center justify-center'>
        <Button variant='outline' size={'lg'} className='flex gap-2 mx-auto hover:bg-beige hover:text-black transition-all uppercase'>
            <FcGoogle />
            Sign in Google
        </Button>
    </div>
  )
}
