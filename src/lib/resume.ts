import { Education, Experience, PersonalInfo } from './types'

// Base API URL helper
function getApiBaseUrl() {
  if (typeof window !== 'undefined') {
    return '/api'
  }
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  return `${baseUrl}/api`
}

export async function fetchResumeData() {
  try {
    const response = await fetch(`${getApiBaseUrl()}/resume`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data: ${response.status} ${response.statusText}`
      )
    }

    return await response.json()
  } catch (err) {
    console.error('Failed to fetch data:', err)
    throw err
  }
}

export async function getResumeDataById(
  type: string,
  id: string
): Promise<Experience | Education | PersonalInfo | null> {
  try {
    const response = await fetch(
      `${getApiBaseUrl()}/resume/${id}?type=${type}`,
      {
        cache: 'no-store',
      }
    )
    if (!response.ok) {
      throw new Error(
        `Failed to fetch data: ${response.status} ${response.statusText}`
      )
    }
    return await response.json()
  } catch (err) {
    console.error('Failed to fetch data by id:', err)
    throw err
  }
}

export async function saveResumeData(
  resumeData: Experience | Education | PersonalInfo,
  type: string,
  id?: string
): Promise<{
  experiences: Experience[]
  education: Education[]
  personalInfo: PersonalInfo[]
}> {
  try {
    const method = id ? 'PUT' : 'POST'
    const url = `${getApiBaseUrl()}/resume${id ? `/${id}` : ''}?type=${type}`

    let dataToSend: any

    if (type === 'experience') {
      const expData = resumeData as Experience
      dataToSend = {
        type,
        ...expData,
        startDate: new Date(expData.startDate),
        endDate: expData.endDate ? new Date(expData.endDate) : null,
      }
    } else if (type === 'education') {
      const eduData = resumeData as Education
      dataToSend = {
        type,
        ...eduData,
        graduationDate: new Date(eduData.graduationDate),
      }
    } else {
      dataToSend = { type, ...resumeData }
    }

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(
        `Failed to ${id ? 'update' : 'create'} data: ${response.status} ${
          response.statusText
        }`
      )
    }

    return await fetchResumeData()
  } catch (err) {
    console.error('Failed to save data:', err)
    throw err
  }
}

export async function deleteResumeData(
  type: string,
  id: string
): Promise<{
  experiences: Experience[]
  education: Education[]
  personalInfo: PersonalInfo[]
}> {
  try {
    const response = await fetch(
      `${getApiBaseUrl()}/resume/${id}?type=${type}`,
      {
        method: 'DELETE',
      }
    )

    if (!response.ok) {
      throw new Error(
        `Failed to delete data: ${response.status} ${response.statusText}`
      )
    }

    return await fetchResumeData()
  } catch (err) {
    console.error('Failed to delete data:', err)
    throw err
  }
}
