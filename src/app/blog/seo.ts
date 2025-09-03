import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Latest news, articles, and updates from Sarah Yousuph',
  robots: {
    index: true,
    follow: true,
  },
}

export const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  '@id': 'https://sarah-yousuph.com/blog',
  mainEntityOfPage: 'https://sarah-yousuph.com/blog',
  name: 'Sarah\'s Blog',
  description:
    'Latest news, articles, and updates from Sarah\'s Blog',
  publisher: {
    '@type': 'Organization',
    '@id': 'https://sarah-yousuph.com',
    name: 'Sarah Yousuph',
    logo: {
      '@type': 'ImageObject',
      '@id': 'https://sarah-yousuph.com/logo.png',
      url: 'https://sarah-yousuph.com/logo.png',
      width: '296',
      height: '74',
    },
  },
}
