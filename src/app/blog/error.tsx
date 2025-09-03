'use client'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className='flex min-h-screen flex-col px-4 py-8 container mx-auto'>
      <h1 className='text-3xl font-bold tracking-tight sm:text-4xl xl:text-5xl prose-h1 my-6'>
        Blog
      </h1>
      <div className='flex flex-col items-center mt-12'>
        <h2 className='mx-auto mb-10 text-xl prose capitalize'>
          {'Error: ' + error.message || 'Something went wrong!'}
        </h2>
        <Button
          variant='secondary'
          size='lg'
          className='w-fit mx-auto'
          onClick={reset}
        >
          Try again
        </Button>
      </div>
    </main>
  )
}
