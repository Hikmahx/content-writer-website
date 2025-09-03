'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'


export default function Search({ searchTerm }: { searchTerm: string }) {
  const [searchInput, setSearchInput] = useState(searchTerm)
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const basePath = pathname.split('/')[1]
  const { replace } = useRouter()

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())

    if (searchInput !== '') {
      params.set('search', searchInput)
      params.delete('page')
      params.delete('sortBy')
    } else {
      params.delete('search')
    }

    replace(`/${basePath}?${params.toString()}`)
  }

  function handleClearSearch(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()

    setSearchInput(e.target.value)

    if (e.target.value === '') {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('search')
      params.delete('page')
      params.delete('sortBy')

      replace(`/${basePath}?${params.toString()}`)
    }
  }

  return (
    <form onSubmit={(e) => handleSearch(e)}>
      <Input
        type='text'
        placeholder='Search'
        className='max-w-xs'
        value={searchInput}
        onChange={(e) => handleClearSearch(e)}
      />
    </form>
  )
}
