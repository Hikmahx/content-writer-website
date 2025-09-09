import PostEditor from '@/components/admin/editor/PostEditor'

interface EditPostPageProps {
  params: {
    slug: string
  }
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { slug } = await params
  return (
    <div className='min-h-screen bg-background'>
      <PostEditor postSlug={slug} />
    </div>
  )
}
