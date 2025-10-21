'use client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type Option = { label: string; value: string }

type SelectDropdownProps = {
  label: string
  paramKey: string
  options?: Option[] // make it optional
  defaultValue?: string
  className?: string
}

export default function SelectDropdown({
  label,
  paramKey,
  options = [],
  defaultValue,
  className,
}: SelectDropdownProps) {
  const pathname = usePathname()
  const basePath = pathname.split('/')[1]
  const { replace } = useRouter()
  const searchParams = useSearchParams()

  const safeDefault = defaultValue || (options.length > 0 ? options[0].value : '')

  const currentValue = searchParams.get(paramKey) || safeDefault

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value === 'all') {
      params.delete(paramKey)
    } else {
      params.set(paramKey, value)
    }

    params.delete('page')

    replace(`/${basePath}?${params.toString()}`)
  }

  if (!options.length) return null

  return (
    <Select value={currentValue} onValueChange={handleChange}>
      <SelectTrigger className={className || 'w-[180px]'}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent className='relative z-20'>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} className='capitalize'>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
