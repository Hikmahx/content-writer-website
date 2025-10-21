import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <main className='flex min-h-screen flex-col px-4 xl:px-0 py-8 container mx-auto lg:max-w-7xl'>
      {/* Header Section */}
      <div className='w-full flex flex-col lg:flex-row gap-4 justify-between mb-4 lg:mb-12 mt-8 lg:justify-center'>
        <div className='flex flex-col justify-center text-center gap-8 mb-8'>
          <Skeleton className='h-12 w-64 mx-auto bg-slate-200 rounded-md' />
          <Skeleton className='h-4 w-3/4 mx-auto bg-slate-200 rounded-md' />
          <Skeleton className='h-4 w-2/3 mx-auto bg-slate-200 rounded-md' />
        </div>

        {/* Mobile filters skeletons */}
        <div className='flex flex-col sm:flex-row gap-6 w-full justify-between lg:hidden'>
          <Skeleton className='h-10 w-full sm:max-w-[200px] bg-slate-200 rounded-md' />
          <div className='flex gap-4 w-full sm:w-auto'>
            <Skeleton className='h-10 w-full sm:max-w-[200px] bg-slate-200 rounded-md' />
            <Skeleton className='h-10 w-full sm:max-w-[200px] bg-slate-200 rounded-md' />
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className='flex gap-12'>
        {/* Left column (posts) */}
        <div className='flex flex-col flex-1 mx-auto gap-x-6 gap-y-4 md:gap-y-0 w-full max-w-5xl'>
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

        {/* Right column (sidebar) */}
        <div className='hidden w-1/5 h-fit sticky top-10 lg:flex flex-col gap-8'>
          <Skeleton className='h-10 w-full bg-slate-200 rounded-md' />

          <div className='mt-8'>
            <Skeleton className='h-6 w-32 bg-slate-200 mb-3' />
            <Skeleton className='h-10 w-full bg-slate-200 rounded-md' />
          </div>

          <div>
            <Skeleton className='h-6 w-40 bg-slate-200 mb-4' />
            <ul className='space-y-2 rounded-md py-4 bg-slate-100/50 w-full'>
              {[...Array(4)].map((_, i) => (
                <li key={i}>
                  <Skeleton className='h-6 w-32 bg-slate-200 mx-6' />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Pagination skeleton */}
      <div className='py-9 flex items-center justify-center'>
        <Skeleton className='h-10 w-60 bg-slate-200 rounded-md' />
      </div>
    </main>
  )
}
