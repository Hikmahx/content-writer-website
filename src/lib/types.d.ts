// import type { Post, PostStatus } from "@prisma/client"


// import type { Post, PostStatus } from "@prisma/client"

// export type { Post, PostStatus }

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
}

export interface UpdatePostData extends Partial<CreatePostData> {
  id: string
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  img?: string;
  hashtags: string[];
  published: boolean;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    name:string;
    image: string
  }
}


export interface Experience {
  id: string
  organization: string
  position: string
  location: string
  startDate: string
  endDate?: string
  responsibilities: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  major?: string
  gpa?: string
  location: string
  graduationDate: string
}

export interface PersonalInfo {
  firstName: string
  lastName: string
  email: string
  address: string
  linkedin: string
}

export interface Resume {
  experiences: Experience[]
  education: Education[]
  personalInfo: PersonalInfo
}