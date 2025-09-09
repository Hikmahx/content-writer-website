import PostEditor from '@/components/admin/editor/PostEditor'

interface EditPostPageProps {
  params: {
    id: string
  }
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params
  return (
    <div className='min-h-screen bg-background'>
      <PostEditor postId={id} />
    </div>
  )
}
