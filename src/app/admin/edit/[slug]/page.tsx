import PostEditor from '@/components/admin/editor/PostEditor'

interface EditPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { slug } = await params
  return (
    <div className='min-h-screen bg-background'>
      <PostEditor postSlug={slug} />
    </div>
  )
}
