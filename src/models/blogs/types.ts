export interface PostMeta {
  slug: string
  title: string
  author: { name: string, avatar: string }
  id: string
  img: string
  description: string
  hashtags: string[]
  createdAt: number
  /**
   * The slugs of related posts
   */
  related: string[]
}

export type PostMetaEx = Omit<PostMeta, 'related'> & { related: PostMeta[] }
