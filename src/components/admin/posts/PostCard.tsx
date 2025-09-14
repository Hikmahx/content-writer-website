'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Edit, Eye } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import type { Post } from '@/lib/types'
import DeletePostModal from './DeletePostModal'

interface PostCardProps {
  post: Post
  onDelete?: (postSlug: string) => Promise<void>
}

export default function PostCard({ post, onDelete }: PostCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date))
  }

  const getWordCount = (content: string) => {
    return content.split(/\s+/).filter((word) => word.length > 0).length
  }

  return (
    <Card className='bg-card border-border hover:shadow-md transition-shadow'>
      <CardContent className='p-6'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <Link href={`/admin/edit/${post.slug}`}>
              <h3 className='text-lg font-semibold text-card-foreground hover:text-primary cursor-pointer mb-2'>
                {post.title}
              </h3>
            </Link>
            <p className='text-muted-foreground text-sm mb-4 line-clamp-2'>
              {post.description}
            </p>
            <div className='flex items-center gap-4 text-xs text-muted-foreground'>
              <span>{formatDate(post.createdAt)}</span>
              <span>•</span>
              <span>{getWordCount(post.content)} words</span>
              {post.hashtags.length > 0 && (
                <>
                  <span>•</span>
                  <div className='flex gap-1'>
                    {post.hashtags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className='bg-muted px-2 py-1 rounded text-xs'
                      >
                        #{tag}
                      </span>
                    ))}
                    {post.hashtags.length > 2 && (
                      <span className='text-muted-foreground'>
                        +{post.hashtags.length - 2} more
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem asChild>
                <Link href={`admin/edit/${post.slug}`}>
                  <Edit className='h-4 w-4 mr-2' />
                  Edit
                </Link>
              </DropdownMenuItem>
              {post.published && (
                <DropdownMenuItem asChild>
                  <Link href={`/blog/${post.slug}`}>
                    <Eye className='h-4 w-4 mr-2' />
                    View
                  </Link>
                </DropdownMenuItem>
              )}
              <DeletePostModal
                postSlug={post.slug}
                postTitle={post.title}
                onDelete={onDelete}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}
