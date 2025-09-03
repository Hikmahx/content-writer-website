import BackButton from '@/components/blog/BackButton'
import { Skeleton } from '@/components/ui/skeleton'


export default function Loading() {
  return (
    <main className='py-20'>
      <div className='container max-w-xl lg:max-w-[850px] mx-auto px-4 py-6 md:px-6 '>
        <BackButton />
        <article className=''>
          <section className=''>
            <Skeleton className='h-10 w-3/4 mb-4 bg-slate-200' />
            <div className='flex items-center gap-2'>
              <Skeleton className='w-10 h-10 rounded-full bg-slate-200' />
              <Skeleton className='h-6 w-24 bg-slate-200' />
              <Skeleton className='h-6 w-32 bg-slate-200' />
            </div>
          </section>
          <section className=''>
            <Skeleton className='h-40 w-full mt-4 bg-slate-200' />
            <Skeleton className='h-40 w-full mt-4 bg-slate-200' />
            <Skeleton className='h-40 w-full mt-4 bg-slate-200' />
            <Skeleton className='h-20 w-1/2 mt-4 bg-slate-200' />
            <Skeleton className='h-10 w-full mt-4 bg-slate-200' />
          </section>
        </article>
      </div>
    </main>
  )
}
