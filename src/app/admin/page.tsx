import PostsHeader from '@/components/admin/posts/PostsHeader'
import PostsTabs from '@/components/admin/posts/PostsTabs'

export default function PostsPage() {
  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <PostsHeader />
        <PostsTabs />
      </div>
    </div>
  )
}
