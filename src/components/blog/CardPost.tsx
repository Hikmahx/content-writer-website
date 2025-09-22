import type { Post } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import PostDate from './PostDate'

export default function CardPost({ post }: { post: Post }) {
  const createdAt = useMemo(() => new Date(post.createdAt), [post.createdAt])
  return (
    <Card className='w-full prose prose-slate max-w-none relative rounded-none shadow-none flex flex-col md:flex-row items-center justify-between border-white border-b border-b-gray-300 first:border-t first:border-t-gray-300 gap-x-4'>
      <div className='order-2 md:order-1 w-full'>
        <CardHeader className='py-1 space-y-0 px-0'>
          <div className='flex items-center gap-2'>
            <div className='py-5'>
              <Image
                className='w-10 h-10 border border-gray-100 rounded-full my-2'
                src={post.author.image}
                alt='placeholder'
                width={40}
                height={40}
              />
            </div>
            <div className='flex flex-col text-xs'>
              <span className='m-0 font-bold'>{post.author.name}</span>
              <PostDate time={post.createdAt} />
            </div>
          </div>
          <Link href={`/blog/${post.slug}`} className='hover:text-beige no-underline'>
            <CardTitle className='py-2 font-serif'>{post.title}</CardTitle>
          </Link>
        </CardHeader>
        <CardContent className='pb-0 px-0'>
          <p className='font-normal text-sm my-0 font-sans text-gray-500 w-full max-w-lg mr-auto'>
            {post.description.slice(0, 150) + '...'}
          </p>
        </CardContent>
        <CardFooter className='px-0'>
          <div className='flex items-center gap-2 mt-4'>
            <div className='flex gap-2 flex-wrap'>
              {post.hashtags.map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className='no-underline text-xs font-thin bg-beige/70 px-3 py-1 rounded-full w-auto'
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </CardFooter>
      </div>
      <div className='overflow-hidden mt-4 md:mt-0 md:order-1 w-full max-w-sm'>
        {post.img ? (
          <>
            <Image
              className='w-full h-auto mx-0 rounded-lg my-4'
              src={post.img}
              alt='placeholder'
              width={300}
              height={120}
            />
          </>
        ) : (
          <div className='h-[260px] w-full min-w-[300px] bg-gray-100 rounded-lg my-4'></div>
        )}
      </div>
    </Card>
  )
}
