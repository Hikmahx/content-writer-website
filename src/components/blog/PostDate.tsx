'use client'
import { useMemo } from 'react'


export default function PostDate({ time }: Readonly<{ time: number }>) {
  const [ timeStr, humanTimeStr ] = useMemo(() => {
    const _time = new Date(time)
    return [
      _time.toISOString(),
      _time.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    ] as const
  }, [ time ])
  return <time dateTime={timeStr}>
    {humanTimeStr}
  </time>
}
