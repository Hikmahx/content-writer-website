import { Education, Experience, PersonalInfo, Resume } from './types'

function getApiBaseUrl() {
  if (typeof window !== 'undefined') return '/api'
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  return `${baseUrl}/api`
}

export async function fetchResumeData(): Promise<Resume> {
  const res = await fetch(`${getApiBaseUrl()}/resume`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Failed to fetch data: ${res.statusText}`)
  return res.json()
}

export async function getResumeDataById<
  T extends Experience | Education | PersonalInfo
>(type: string, id: string): Promise<T | null> {
  const res = await fetch(`${getApiBaseUrl()}/resume/${id}?type=${type}`, {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Failed to fetch ${type} by id`)
  return await res.json()
}

export async function saveResumeData(
  resumeData: Partial<Experience | Education | PersonalInfo>,
  type: 'experience' | 'education' | 'personal',
  id?: string
): Promise<Resume> {
  const method = id ? 'PUT' : 'POST'
  const url = `${getApiBaseUrl()}/resume${id ? `/${id}` : ''}?type=${type}`

  let bodyData: any = { type, ...resumeData }

  if (type === 'experience') {
    const exp = resumeData as Experience
    bodyData = {
      ...bodyData,
      startDate: exp.startDate ? new Date(exp.startDate) : null,
      endDate: exp.endDate ? new Date(exp.endDate) : null,
    }
  } else if (type === 'education') {
    const edu = resumeData as Education
    bodyData = {
      ...bodyData,
      graduationDate: edu.graduationDate ? new Date(edu.graduationDate) : null,
    }
  }

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bodyData),
    cache: 'no-store',
  })

  if (!res.ok) throw new Error(`Failed to ${id ? 'update' : 'create'} ${type}`)
  return fetchResumeData()
}

export async function deleteResumeData(
  type: string,
  id: string
): Promise<Resume> {
  const res = await fetch(`${getApiBaseUrl()}/resume/${id}?type=${type}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error(`Failed to delete ${type}`)
  return fetchResumeData()
}
