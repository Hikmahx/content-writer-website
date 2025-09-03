'use client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect } from 'react'
import { RxCaretLeft } from 'react-icons/rx'


export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className='py-20'>
      <div className='container max-w-xl lg:max-w-[850px] mx-auto px-4 py-6 md:px-6'>
        <Link href='/blog' className='flex items-center my-2 prose'>
          <RxCaretLeft />
          BACK
        </Link>
        <div className='flex flex-col items-center mt-12'>
          <h2 className='mx-auto mb-10 text-xl prose capitalize'>
            {'Error: ' + error.message || 'Something went wrong!'}
          </h2>
          <Button className='w-fit mx-auto' onClick={reset}>
            Try again
          </Button>
        </div>
      </div>
    </main>
  )
}
