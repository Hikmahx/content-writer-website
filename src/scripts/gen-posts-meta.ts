import { POSTS_FOLDER } from '@/models/blogs/constants'
import type { PostMeta } from '@/models/blogs/types'
import { readdir, readFile, writeFile } from 'fs/promises'
import matter from 'gray-matter'
import path from 'path'


// NOTE: this path resolution requires this file to run directly without build
const postsMetaFile = path.join(__dirname, '../models/blogs/postsMeta.json')


function addTagPostMeta(
  tagToPostsMeta: Map<string, PostMeta[]>,
  tag: string,
  meta: PostMeta
) {
  const postsMeta = tagToPostsMeta.get(tag)
  if (postsMeta) {
    postsMeta.push(meta)
  } else {
    tagToPostsMeta.set(tag, [ meta ])
  }
}

async function main() {
  const postFiles = (await readdir(POSTS_FOLDER))
    .filter(file => file.endsWith('.mdx'))
  const tagToPostsMeta = new Map<string, PostMeta[]>()
  const postsMeta = await Promise.all(postFiles.map(async name => {
    const postFilePath = path.join(POSTS_FOLDER, name)
    const body = await readFile(postFilePath, 'utf-8')
    const {
      data: {
        createdAt,
        ..._meta
      }
    } = matter(body)
    const meta = {
      slug: name.substring(0, name.length - '.mdx'.length),
      ..._meta,
      createdAt: typeof createdAt === 'number'
        ? createdAt
        : new Date(createdAt).getTime(),
      related: [] as string[]
    } as PostMeta
    meta.hashtags.forEach(tag => addTagPostMeta(tagToPostsMeta, tag, meta))
    return meta
  }))
  // Fill in `postMeta.related`
  for (const postMeta of postsMeta) {
    const relatedPosts = new Set<PostMeta>()
    const addRelatedPosts = (posts?: PostMeta[]) => {
      posts?.forEach(post => {
        if (postMeta.slug !== post.slug) {
          relatedPosts.add(post)
        }
      })
    }
    postMeta.hashtags
      .forEach(tag => addRelatedPosts(tagToPostsMeta.get(tag)))
    postMeta.related = [ ...relatedPosts ]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 3)
      .map(({ slug }) => slug)
  }
  postsMeta.sort((a, b) => b.createdAt - a.createdAt)
  console.log('Generating posts metadata file', postsMetaFile)
  await writeFile(postsMetaFile, JSON.stringify(postsMeta))
}

main()
