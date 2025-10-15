import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth' 
import PostsHeader from '@/components/admin/posts/PostsHeader'
import PostsTabs from '@/components/admin/posts/PostsTabs'

export default async function AdminPostsPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/') 
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <PostsHeader />
        <PostsTabs />
      </div>
    </div>
  )
}
