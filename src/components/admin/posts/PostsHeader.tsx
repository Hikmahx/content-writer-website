import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default function StoriesHeader() {
  return (
    <div className='flex items-center justify-between mb-8'>
      <div>
        <h1 className='text-3xl font-bold text-foreground mb-2'>
          Your articles
        </h1>
        <p className='text-muted-foreground'>
          Create and manage your blog posts
        </p>
      </div>
      <Link href='/admin/new'>
        <Button variant='default' className='bg-black text-white hover:bg-beige hover:text-foreground transition-all'>
          <Plus className='w-4 h-4 mr-2' />
          Write an article
        </Button>
      </Link>
    </div>
  )
}
