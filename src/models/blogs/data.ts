import assert from 'assert'
import { promises as fs } from 'fs'
import Fuse from 'fuse.js'
import matter from 'gray-matter'
import path from 'path'
import { cache } from 'react'
import { POSTS_FOLDER } from './constants'
import postsMeta from './postsMeta'
import type { PostMeta, PostMetaEx } from './types'


const fuse = new Fuse(postsMeta, { keys: [ 'title' ] })

/**
 * Get/search for posts
 * @param sortBy sort by `title` or `date`
 * @param page 1-based page number
 * @param keyword search for this keyword in title
 * @param limit the max number of posts per page
 */
export function getPosts(
  sortBy: 'title' | 'date' = 'date',
  page = 1,
  keyword = '',
  limit = 10
) {
  // Search filter (by title)
  const posts = keyword
    ? fuse.search(keyword).map(({ item }) => item)
    : [ ...postsMeta ] // Make a copy because we will sort in place later

  // Sorting (title or date)
  if (sortBy === 'title') {
    // Ascending
    posts.sort((a, b) => a.title.localeCompare(b.title))
  } else {
    // Descending
    posts.sort((a, b) => b.createdAt - a.createdAt)
  }

  // Pagination
  const startIndex = (page - 1) * limit
  const paginatedPosts = posts.slice(startIndex, startIndex + limit)
  const pageCount = Math.ceil(postsMeta.length / limit)

  return {
    posts: paginatedPosts,
    currentPage: page,
    pageCount: pageCount
  }
}

let slugToPosts: Map<string, PostMeta>
function getSlugToPosts() {
  if (slugToPosts) return slugToPosts
  slugToPosts = new Map()
  postsMeta.forEach(post => slugToPosts.set(post.slug, post))
  return slugToPosts
}

function getPostBySlug(slug: string) {
  return getSlugToPosts().get(slug)
}

/**
 * Get the metadata and the content of the post by its slug
 */
async function _getPost(slug: string) {
  const post = getPostBySlug(slug)

  if (!post) {
    throw new Error(`Post not found: ${slug}`)
  }

  const filePath = path.join(POSTS_FOLDER, `${post.slug}.mdx`)
  assert(!post.slug.includes('..')) // Just in case
  const fileContent = await fs.readFile(filePath, 'utf-8')
  const { content } = matter(fileContent)

  return {
    ...post,
    content,
    related: post.related.map(getPostBySlug) as PostMeta[]
  } satisfies PostMetaEx & { content: string }
}

export const getPost = cache(_getPost)
