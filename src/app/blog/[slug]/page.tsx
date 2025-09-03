import BackButton from '@/components/blog/BackButton'
import RelatedCardPost from '@/components/blog/RelatedCardPost'
import ShareButton from '@/components/global/ShareButton'
import { getPost } from '@/models/blogs/data'
import postsMeta from '@/models/blogs/postsMeta'
import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Image from 'next/image'
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'


const components = {
  SyntaxHighlighter: ({
    children,
    language
  }: {
    children: string
    language: string
  }) => (
    <SyntaxHighlighter language={language} style={atomOneDark}>
      {children}
    </SyntaxHighlighter>
  )
}

// Return 404 for non-exist slugs
export const dynamicParams = false

export async function generateStaticParams() {
  return postsMeta.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const slug = decodeURIComponent(params.slug)

  const { title, description, img } = await getPost(slug)

  return {
    title,
    description,
    openGraph: {
      type: 'article',
      title,
      description,
      images: img
    }
  }
}

export default async function Page({
  params: { slug }
}: {
  params: { slug: string }
}) {
  const {
    title,
    author,
    createdAt,
    hashtags,
    content,
    related,
  } = await getPost(slug)

  return (
    <main className='pb-20'>
      <div className='container max-w-xl lg:max-w-[850px] mx-auto px-4 py-6 md:px-6'>
        <div className='flex items-start justify-between'>
          <BackButton />
          <ShareButton />
        </div>
        <article className='prose prose-img:rounded-xl max-w-none mt-2'>
          <section>
            <h1 className='text-3xl font-bold tracking-wide sm:text-4xl xl:text-5xl xl:leading-[1.32] mb-2'>
              {title}
            </h1>
            <div className='flex items-center gap-2 pb-3'>
              <div>
                <Image
                  className='w-10 h-10 !rounded-full my-2 border border-gray-100 hover:bg-gray-300'
                  src={author.avatar}
                  alt='placeholder'
                  width={40}
                  height={40}
                />
              </div>
              <span className='prose mr-2 font-bold capitalize'>
                {author.name}
              </span>
              <span className='text-gray-500 '>
                {new Date(createdAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className='flex flex-wrap gap-3'>
              {hashtags.map((tag: string, index: number) => (
                <span
                  key={`${tag}-${index}`}
                  className='uppercase !font-normal text-[8px] lg:!text-[10px] text-slate-500 py-1 rounded-full w-auto'
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
          <section className='prose prose-gray max-w-none not-italic prose-lg mt-8 prose-p:leading-8 prose-h3:leading-9 prose-h2:leading-10 prose-li:text-lg prose-a:font-normal prose-h2:text-2xl prose-h3:text-xl'>
            <MDXRemote source={content} components={components} />
          </section>
        </article>
        <div>
          <hr className='my-12' />
          <h2 className='text-3xl font-bold tracking-wide sm:text-3xl xl:text-4xl capitalize pb-8 mt-4'>
            Related Articles
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {related.map((relatedPost) => (
              <div
                key={relatedPost.slug}
                className='flex items-center gap-2'
              >
                <RelatedCardPost post={relatedPost} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
