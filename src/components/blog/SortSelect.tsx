'use client'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function SortSelect() {
  const pathname = usePathname()
  const basePath = pathname.split('/')[1]
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('sortBy') || 'date'

  const handleChange = (sortBy: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (sortBy !== 'title') {
      params.delete('sortBy')
    } else {
      params.set('sortBy', sortBy)
    }

    // Reset to first page when changing sort
    params.delete('page')

    replace(`/${basePath}?${params.toString()}`)
  }

  return (
    <Select
      value={currentSort}
      onValueChange={(value: string) => handleChange(value)}
    >
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='Sort By' />
      </SelectTrigger>
      <SelectContent className='relative z-20'>
        <SelectGroup>
          <SelectLabel>Sort By</SelectLabel>
          <SelectItem value='date'>Created At</SelectItem>
          <SelectItem value='title'>Title</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
