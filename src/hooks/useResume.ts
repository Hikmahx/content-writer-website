import useSWR from 'swr'
import { fetcher, getApiUrl } from '@/lib/swr-config'
import type { Resume, Experience, Education, PersonalInfo } from '@/lib/types'
import { mutate } from 'swr'
import axios from 'axios'

export function useResume() {
  const key = getApiUrl('/resume')

  const {
    data,
    error,
    isLoading,
    mutate: mutateResume,
  } = useSWR<Resume>(key, fetcher)

  return {
    resume: data || {
      experiences: [],
      education: [],
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        linkedin: '',
        address: '',
      },
    },
    isLoading,
    isError: !!error,
    error,
    mutate: mutateResume,
  }
}

export function useResumeDataById<
  T extends Experience | Education | PersonalInfo
>(type: string, id: string | null | undefined) {
  const key = id && type ? getApiUrl(`/resume/${id}`, { type }) : null

  const customFetcher = async (url: string): Promise<T> => {
    const response = await axios.get(url, {
      headers: { 'Cache-Control': 'no-store' },
    })

    if (response.status !== 200) {
      throw new Error(`Failed to fetch ${type} by id`)
    }

    const data = response.data
    return (data[type] || data) as T
  }

  const {
    data,
    error,
    isLoading,
    mutate: mutateResumeData,
  } = useSWR<T>(key, customFetcher)

  return {
    data: data || null,
    isLoading,
    isError: !!error,
    error,
    mutate: mutateResumeData,
  }
}

export async function mutateResumeCache() {
  await mutate((key) => typeof key === 'string' && key.includes('/resume'))
}

