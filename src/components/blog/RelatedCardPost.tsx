import type { PostMeta } from '@/models/blogs/types'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import PostDate from './PostDate'


export default function RelatedCardPost({ post }: { post: PostMeta }) {
  return (
    <Card className='prose lg:prose-xl prose-slate relative grid grid-rows-[auto_1fr_auto] h-full shadow-none mx-auto overflow-hidden'>
      <Link href={`/blog/${post.slug}`} className='absolute inset-0'></Link>
      <div className='overflow-hidden'>
        <Image
          className='w-full h-40 m-0 lg:m-0 rounded-none object-scale-down border border-gray-100'
          src={post.img}
          alt='placeholder'
          width={300}
          height={120}
        />
      </div>
      <CardHeader className='py-1 space-y-0 px-4'>
        <div className='flex text-xs mt-4 gap-1 text-gray-500'>
          <span className='m-0 '>{post.author.name}</span>
          <span className=''>|</span>
          <span className='text-4xl'></span>
          <PostDate time={post.createdAt} />
        </div>
        <CardTitle className='py-4 lg:text-xl leading-snug'>{post.title}</CardTitle>
      </CardHeader>
      <CardContent className='px-4'>
        <p className='font-normal text-sm my-0 lg:my-0 text-gray-500'>
          {post.description.slice(0, 100) + '...'}
        </p>
      </CardContent>
    </Card>
  )
}
