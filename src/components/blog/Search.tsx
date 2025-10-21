'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { SearchIcon, X } from 'lucide-react'

export default function Search({ searchTerm }: { searchTerm: string }) {
  const [searchInput, setSearchInput] = useState(searchTerm)
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const basePath = pathname.split('/')[1]
  const { replace } = useRouter()

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())

    if (searchInput.trim() !== '') {
      params.set('search', searchInput.trim())
      params.delete('page')
      params.delete('sortBy')
    } else {
      params.delete('search')
    }

    replace(`/${basePath}?${params.toString()}`)
  }

  function handleClear() {
    setSearchInput('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('search')
    params.delete('page')
    replace(`${pathname}?${params.toString()}`)
  }
  return (
    <form onSubmit={(e) => handleSearch(e)}>
      <div className='relative w-full md:max-w-xs'>
        <Input
          type='text'
          placeholder='Search...'
          className='md:max-w-xs'
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        {searchInput && (
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7'
            onClick={handleClear}
          >
            <X className='h-4 w-4' />
          </Button>
        )}
      </div>
    </form>
  )
}
