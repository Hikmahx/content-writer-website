import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Or } from '@/types/utils'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'
import { HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight } from 'react-icons/hi'


export interface PaginationState {
  pageIndex: number
  setPageIndex: React.Dispatch<React.SetStateAction<number>>
  pageSize: number
  setPageSize: React.Dispatch<React.SetStateAction<number>>
  pageCount: number
  loading: boolean
}

export interface CursorPaginationState {
  pageIndex: number
  onNext: () => void
  onPrev: () => void
  onReset: () => void
  pageSize: number
  setPageSize: React.Dispatch<React.SetStateAction<number>>
  pageCount: number
  loading: boolean
}

interface PaginationProps {
  pagination: Or<PaginationState, CursorPaginationState>
  scrollTo?: () => void
}

export default function Pagination({
  pagination: {
    pageIndex,
    setPageIndex,
    onPrev,
    onNext,
    onReset,
    pageSize,
    setPageSize,
    pageCount,
    loading
  },
  scrollTo
}: Readonly<PaginationProps>) {
  return (
    <div className='flex items-center justify-between sm:justify-center space-x-4 lg:space-x-6 w-full sm:w-fit'>
      <div className='flex items-center space-x-2'>
        <p className='text-sm font-medium hidden sm:block'>Rows per page</p>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => {
            onReset?.()
            setPageIndex?.(0)
            setPageSize(Number(value))
          }}
        >
          <SelectTrigger className='h-8 w-[70px]'>
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent side='top'>
            {[10, 20, 30].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='hidden sm:flex items-center justify-center text-sm font-medium'>
        Page {pageIndex + 1} of {pageCount}
      </div>
      <div className='flex items-center space-x-2'>
        <Button
          variant='outline'
          className='hidden h-8 w-8 p-0 lg:flex'
          onClick={() => {
            onReset?.()
            setPageIndex?.(0)
            scrollTo?.()
          }}
          disabled={loading || pageIndex <= 0}
        >
          <span className='sr-only'>Go to first page</span>
          <HiOutlineChevronDoubleLeft className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          className='h-8 w-8 p-0 border-transparent sm:border-input'
          onClick={() => {
            onPrev?.()
            setPageIndex?.((p) => p - 1)
            scrollTo?.()
          }}
          disabled={loading || pageIndex <= 0}
        >
          <span className='sr-only'>Go to previous page</span>
          <MdChevronLeft className='h-4 w-4' />
        </Button>
        <span className='sm:hidden'>
          {pageIndex + 1} / {pageCount}
        </span>
        <Button
          variant='outline'
          className='h-8 w-8 p-0 border-transparent sm:border-input'
          onClick={() => {
            onNext?.()
            setPageIndex?.((p) => p + 1)
            scrollTo?.()
          }}
          disabled={loading || pageIndex + 1 >= pageCount}
        >
          <span className='sr-only'>Go to next page</span>
          <MdChevronRight className='h-4 w-4' />
        </Button>
        {setPageIndex ? (
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => {
              setPageIndex(pageCount - 1)
              scrollTo?.()
            }}
            disabled={loading || pageIndex + 1 >= pageCount}
          >
            <span className='sr-only'>Go to last page</span>
            <HiOutlineChevronDoubleRight className='h-4 w-4' />
          </Button>
        ) : null}
      </div>
    </div>
  )
}
