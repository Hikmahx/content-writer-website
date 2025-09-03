import { Skeleton } from '@/components/ui/skeleton'
import Search from '@/components/blog/Search'
import SortSelect from '@/components/blog/SortSelect'


export default function Loading() {
  return (
    <main className='flex min-h-screen flex-col px-4 xl:px-0 py-8 container mx-auto lg:max-w-7xl'>
      <Search searchTerm='' />
      <div className='w-full flex justify-between mb-4 mt-8'>
        <h1 className='text-2xl font-bold tracking-tight prose-h1'>Articles</h1>
        <SortSelect />
      </div>
      <div className='flex flex-col mx-auto gap-x-6 gap-y-2 w-full'>
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className='w-full relative rounded-none shadow-none flex flex-col md:flex-row items-center justify-between border-white border-b border-b-gray-300 first:border-t first:border-t-gray-300 gap-x-4 py-4'
          >
            <div className='order-2 md:order-1 flex-1 w-full md:max-w-lg'>
              <div className='py-1 space-y-0 px-0'>
                <div className='flex items-center gap-2'>
                  <Skeleton className='w-10 h-10 bg-slate-200 rounded-full my-7' />
                  <div className='flex flex-col text-xs'>
                    <Skeleton className='h-4 w-32 bg-slate-200 mb-2' />
                    <Skeleton className='h-4 w-24 bg-slate-200' />
                  </div>
                </div>
                <Skeleton className='h-9 w-3/4 md:w-full bg-slate-200' />
              </div>
              <div className='pb-0 px-0 mb-6 mt-4'>
                <Skeleton className='h-3 w-full bg-slate-200 mb-2' />
                <Skeleton className='h-3 w-full bg-slate-200 mb-2' />
                <Skeleton className='h-3 w-3/4 bg-slate-200 mb-2' />
              </div>
              <div className='px-0 mt-4 flex gap-2 flex-wrap'>
                {[...Array(3)].map((_, tagIndex) => (
                  <Skeleton
                    key={tagIndex}
                    className='h-6 w-16 bg-slate-200 rounded-full'
                  />
                ))}
              </div>
            </div>
            <Skeleton className='w-full md:w-80 h-40 md:h-60 bg-slate-200 rounded-lg md:order-1' />
          </div>
        ))}
      </div>
    </main>
  )
}
