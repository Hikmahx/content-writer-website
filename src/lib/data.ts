import type { Experience, Education, PersonalInfo } from './types'

export const experienceData: Experience[] = [
  {
    id: '1',
    organization: 'Creative Media Hub',
    position: 'Senior Content Writer',
    location: 'New York, NY',
    startDate: '2023-02-01',
    endDate: '2025-03-01',
    responsibilities: [
      'Produced high-ranking SEO articles that increased organic traffic by 120%',
      'Developed editorial calendars and managed a team of freelance writers',
      'Collaborated with marketing team to align content with brand voice and campaigns',
    ],
  },
  {
    id: '2',
    organization: 'Bright Digital Agency',
    position: 'Content Strategist',
    location: 'Remote',
    startDate: '2021-07-01',
    endDate: '2023-01-31',
    responsibilities: [
      'Created content strategies for B2B clients across tech and finance sectors',
      'Optimized web copy, blogs, and landing pages to improve conversion rates by 35%',
      'Led keyword research and competitive analysis to guide content planning',
    ],
  },
  {
    id: '3',
    organization: 'StartupStory',
    position: 'Copywriter',
    location: 'Austin, TX',
    startDate: '2020-05-01',
    endDate: '2021-06-30',
    responsibilities: [
      'Wrote engaging website copy, email campaigns, and product descriptions',
      'Maintained consistent brand messaging across multiple digital platforms',
      'Partnered with designers to create compelling storytelling through visuals and text',
    ],
  },
  {
    id: '4',
    organization: 'Inspire Media Co.',
    position: 'Junior Content Writer',
    location: 'Chicago, IL',
    startDate: '2019-03-15',
    endDate: '2020-04-30',
    responsibilities: [
      'Authored blog posts and social media captions tailored for different audiences',
      'Edited and proofread articles to ensure clarity, grammar, and SEO compliance',
      'Supported senior writers in research and idea generation for new campaigns',
    ],
  },
  {
    id: '5',
    organization: 'Campus Press Club',
    position: 'Editorial Intern',
    location: 'Boston, MA',
    startDate: '2018-09-01',
    endDate: '2018-12-31',
    responsibilities: [
      'Researched and drafted articles for student publication on lifestyle and technology',
      'Conducted interviews with faculty and students for feature stories',
      'Assisted editorial team with content scheduling and fact-checking',
    ],
  },
]

export const educationData: Education[] = [
  {
    id: '1',
    institution: 'Unilorin',
    degree: 'B. Sc',
    major: 'Physiology',
    location: 'Kwara State, Ilorin',
    graduationDate: '2021-08-03',
  },
]

export const personalInfo: PersonalInfo = {
  firstName: 'Sarah',
  lastName: 'Yousuph',
  email: 'adenikeangel.sy@gmail.com',
  address: 'Lagos, Nigeria',
  linkedin: 'https://ng.linkedin.com/in/sarah-yousuph-8891a3237',
}
