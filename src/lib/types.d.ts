import type { Post, PostStatus } from "@prisma/client"

export type { Post, PostStatus }

export interface PostWithRelated extends Post {
  relatedPosts: Post[]
}

export interface PostsResponse {
  posts: Post[]
  currentPage: number
  pageCount: number
  totalCount: number
}

export interface CreatePostData {
  title: string
  slug: string
  description: string
  content: string
  img?: string
  hashtags: string[]
  status: PostStatus
}

export interface UpdatePostData extends Partial<CreatePostData> {
  id: string
}
