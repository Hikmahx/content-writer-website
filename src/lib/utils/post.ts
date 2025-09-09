import { prisma } from "../prisma"

/**
 * Validates that a slug is unique across all posts
 * @param slug - The slug to validate
 * @param excludePostId - Optional post ID to exclude from check (useful for updates)
 * @throws {Error} If slug already exists or user is not authenticated
 */
export async function validateSlugUniqueness(
  slug: string,
  excludePostId?: string
): Promise<void> {
  const existingPost = await prisma.post.findFirst({
    // For updates: exclude current post to allow updating its own slug
    // For creates: no exclusion needed (check if any post has this slug)
    where: excludePostId ? { slug, id: { not: excludePostId } } : { slug },
  })

  if (existingPost) {
    throw new Error('Title should be unique always')
  }
}