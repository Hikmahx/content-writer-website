import axios from 'axios'

// Base API URL helper
function getApiBaseUrl() {
  if (typeof window !== 'undefined') {
    return '/api'
  }
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  return `${baseUrl}/api`
}

// SWR fetcher function
export const fetcher = async (url: string) => {
  const response = await axios.get(url, {
    headers: { 'Cache-Control': 'no-store' },
  })

  if (response.status !== 200) {
    throw new Error(
      `Failed to fetch: ${response.status} ${response.statusText}`
    )
  }

  return response.data
}

// SWR configuration
export const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 2000,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  fetcher, // added default fetcher to config
}

// Helper to build API URL
export function getApiUrl(path: string, params?: Record<string, string>) {
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}${path}`

  if (params) {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value)
    })
    return `${url}?${queryParams.toString()}`
  }

  return url
}
