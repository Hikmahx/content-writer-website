'use client'
import { useRouter } from 'next/navigation'
import { RxCaretLeft } from 'react-icons/rx'


export default function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className='flex items-center my-2 prose pb-12'
    >
      <RxCaretLeft />
      BACK
    </button>
  )
}
