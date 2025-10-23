import { Education, Experience, PersonalInfo, Resume } from './types'
import axios from 'axios'
function getApiBaseUrl() {
  if (typeof window !== 'undefined') return '/api'
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  return `${baseUrl}/api`
}

export async function fetchResumeData(): Promise<Resume> {
  const res = await axios.get(`${getApiBaseUrl()}/resume`, {
    headers: { 'Cache-Control': 'no-store' },
  })
  if (res.status !== 200)
    throw new Error(`Failed to fetch data: ${res.statusText}`)
  return res.data
}

export async function getResumeDataById<
  T extends Experience | Education | PersonalInfo
>(type: string, id: string): Promise<T | null> {
  const res = await axios.get(`${getApiBaseUrl()}/resume/${id}?type=${type}`, {
    headers: { 'Cache-Control': 'no-store' },
  })
  if (res.status !== 200) throw new Error(`Failed to fetch ${type} by id`)
  return res.data
}

export async function saveResumeData(
  resumeData: Partial<Experience | Education | PersonalInfo>,
  type: 'experience' | 'education' | 'personalInfo',
  id?: string
): Promise<Resume> {
  const method = id ? 'PUT' : 'POST'
  const url = `${getApiBaseUrl()}/resume${id ? `/${id}` : ''}?type=${type}`

  let bodyData: any = { type, ...resumeData }

  switch (type) {
    case 'experience': {
      const exp = resumeData as Experience
      bodyData = {
        ...bodyData,
        startDate: exp.startDate ? new Date(exp.startDate) : null,
        endDate: exp.endDate ? new Date(exp.endDate) : null,
      }
      break
    }

    case 'education': {
      const edu = resumeData as Education
      bodyData = {
        ...bodyData,
        graduationDate: edu.graduationDate
          ? new Date(edu.graduationDate)
          : null,
      }
      break
    }

    case 'personalInfo': {
      bodyData = {
        ...bodyData,
      }
      break
    }

    default:
      break
  }

  const res = await (method === 'PUT'
    ? axios.put(url, bodyData)
    : axios.post(url, bodyData))

  if (res.status !== 200)
    throw new Error(`Failed to ${id ? 'update' : 'create'} ${type}`)
  return fetchResumeData()
}

export async function deleteResumeData(
  type: string,
  id: string
): Promise<Resume> {
  const res = await axios.delete(`${getApiBaseUrl()}/resume/${id}?type=${type}`)
  if (res.status !== 200) throw new Error(`Failed to delete ${type}`)
  return fetchResumeData()
}
