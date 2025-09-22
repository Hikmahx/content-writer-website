import BackButton from '@/components/blog/BackButton'
// import RelatedCardPost from '@/components/blog/RelatedCardPost'
import { getPost } from '@/lib/post'
import type { Metadata } from 'next'
import Image from 'next/image'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  try {
    const { slug } = await params
    const post = await getPost(slug)

    if (!post) {
      return {
        title: 'Post Not Found',
      }
    }

    return {
      title: post.title,
      description: post.description,
      openGraph: {
        type: 'article',
        title: post.title,
        description: post.description,
        images: post.img ? [post.img] : [],
      },
    }
  } catch {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.',
    }
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return (
      <div className='min-h-[50vh] flex'>
        <p className='text-xl text-center'>Post Not Found</p>
      </div>
    )
  }

  return (
    <main className='pb-20'>
      <div className='container max-w-xl lg:max-w-[850px] mx-auto px-4 py-6 md:px-6'>
        <div className='flex items-start justify-between'>
          <BackButton />
        </div>
        <article className='prose prose-img:rounded-xl max-w-none mt-2'>
          <section>
            <h1 className='text-3xl font-bold font-serif tracking-wide sm:text-4xl xl:text-5xl xl:leading-[1.32] mb-2'>
              {post.title}
            </h1>
            <div className='flex items-center gap-2 pb-3'>
              <div>
                <Image
                  className='w-10 h-10 !rounded-full my-2 border border-gray-100 hover:bg-gray-300'
                  src={post.author.image}
                  alt={post.author.name}
                  width={40}
                  height={40}
                />
              </div>
              <span className='prose mr-2 font-bold capitalize'>
                {post.author.name}
              </span>
              <span className='text-gray-500 '>
                {new Date(post.createdAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className='flex flex-wrap gap-3'>
              {post.hashtags.map((tag: string, index: number) => (
                <span
                  key={`${tag}-${index}`}
                  className='uppercase !font-normal text-[8px] lg:!text-[10px] text-slate-500 py-1 rounded-full w-auto'
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
          <section
            className='prose prose-gray max-w-none not-italic prose-lg mt-8 prose-p:leading-8 prose-h3:leading-9 prose-h2:leading-10 prose-li:text-lg prose-a:font-normal prose-h2:text-2xl prose-h3:text-xl'
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
        {/* <div>
            <hr className='my-12' />
            <h2 className='text-3xl font-bold tracking-wide sm:text-3xl xl:text-4xl capitalize pb-8 mt-4'>
              Related Articles
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {related.map((relatedPost) => (
                <div key={relatedPost.slug} className='flex items-center gap-2'>
                  <RelatedCardPost post={relatedPost} />
                </div>
              ))}
            </div>
          </div> */}
      </div>
    </main>
  )
}
