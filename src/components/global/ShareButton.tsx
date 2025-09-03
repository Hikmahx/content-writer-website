'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { usePathname } from 'next/navigation'

function ShareArticle() {
  const pathname = usePathname()
  const [copied, setCopied] = useState(false)
  const articleLink = `${window.location.origin}${pathname}`
  const text = `Checkout the latest article on GitRoll: \n \n`
  const hashtags = 'GitRoll'
  const twitterShareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    text
  )}&hashtags=${encodeURIComponent(hashtags)}&url=${encodeURIComponent(
    articleLink
  )}`

  function handleCopyLink() {
    console.log('working')
    navigator.clipboard.writeText(articleLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className='mb-2 mt-3 prose pb-12'>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className='font-bold bg-zinc-100 inline-flex items-center justify-center rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm hover:bg-gray-200 h-9 px-4 py-2 gap-2'
          >
            <svg
              stroke='currentColor'
              fill='none'
              strokeWidth='0'
              viewBox='0 0 15 15'
              height='1em'
              width='1em'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M5 7.50003C5 8.32845 4.32843 9.00003 3.5 9.00003C2.67157 9.00003 2 8.32845 2 7.50003C2 6.6716 2.67157 6.00003 3.5 6.00003C4.32843 6.00003 5 6.6716 5 7.50003ZM5.71313 8.66388C5.29445 9.45838 4.46048 10 3.5 10C2.11929 10 1 8.88074 1 7.50003C1 6.11931 2.11929 5.00003 3.5 5.00003C4.46048 5.00003 5.29445 5.54167 5.71313 6.33616L9.10424 4.21671C9.03643 3.98968 9 3.74911 9 3.50003C9 2.11932 10.1193 1.00003 11.5 1.00003C12.8807 1.00003 14 2.11932 14 3.50003C14 4.88074 12.8807 6.00003 11.5 6.00003C10.6915 6.00003 9.97264 5.61624 9.51566 5.0209L5.9853 7.22738C5.99502 7.31692 6 7.40789 6 7.50003C6 7.59216 5.99502 7.68312 5.9853 7.77267L9.51567 9.97915C9.97265 9.38382 10.6915 9.00003 11.5 9.00003C12.8807 9.00003 14 10.1193 14 11.5C14 12.8807 12.8807 14 11.5 14C10.1193 14 9 12.8807 9 11.5C9 11.2509 9.03643 11.0104 9.10425 10.7833L5.71313 8.66388ZM11.5 5.00003C12.3284 5.00003 13 4.32846 13 3.50003C13 2.6716 12.3284 2.00003 11.5 2.00003C10.6716 2.00003 10 2.6716 10 3.50003C10 4.32846 10.6716 5.00003 11.5 5.00003ZM13 11.5C13 12.3285 12.3284 13 11.5 13C10.6716 13 10 12.3285 10 11.5C10 10.6716 10.6716 10 11.5 10C12.3284 10 13 10.6716 13 11.5Z'
                fill='currentColor'
              ></path>
            </svg>
            <span>Share</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className='z-50 w-72 rounded-md border p-4 shadow-md outline-none md:w-96'>
          <h4 className='font-semibold'>Share this profile</h4>
          <p className='opacity-70 text-sm'>To Twitter, GitHub, everywhere~</p>
          <div className='flex flex-nowrap mt-4 gap-2'>
            <input
              className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 selection:bg-gray-200'
              value={`${articleLink}`}
            />
            <button
              onClick={() => handleCopyLink()}
              className='bg-zinc-100 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-9 px-4 py-2 flex-nowrap whitespace-nowrap gap-2'
            >
              {copied ? (
                <>
                  <svg
                    stroke='currentColor'
                    fill='none'
                    strokeWidth='0'
                    viewBox='0 0 15 15'
                    className='text-green-600'
                    height='1em'
                    width='1em'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z'
                      fill='currentColor'
                    ></path>
                  </svg>
                  <span className='hidden md:block'>Copied!</span>
                </>
              ) : (
                <>
                  <svg
                    stroke='currentColor'
                    fill='none'
                    strokeWidth='0'
                    viewBox='0 0 15 15'
                    height='1em'
                    width='1em'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M1 9.50006C1 10.3285 1.67157 11.0001 2.5 11.0001H4L4 10.0001H2.5C2.22386 10.0001 2 9.7762 2 9.50006L2 2.50006C2 2.22392 2.22386 2.00006 2.5 2.00006L9.5 2.00006C9.77614 2.00006 10 2.22392 10 2.50006V4.00002H5.5C4.67158 4.00002 4 4.67159 4 5.50002V12.5C4 13.3284 4.67158 14 5.5 14H12.5C13.3284 14 14 13.3284 14 12.5V5.50002C14 4.67159 13.3284 4.00002 12.5 4.00002H11V2.50006C11 1.67163 10.3284 1.00006 9.5 1.00006H2.5C1.67157 1.00006 1 1.67163 1 2.50006V9.50006ZM5 5.50002C5 5.22388 5.22386 5.00002 5.5 5.00002H12.5C12.7761 5.00002 13 5.22388 13 5.50002V12.5C13 12.7762 12.7761 13 12.5 13H5.5C5.22386 13 5 12.7762 5 12.5V5.50002Z'
                      fill='currentColor'
                    ></path>
                  </svg>
                  <span className='hidden md:block'>Copy Link</span>
                </>
              )}
            </button>
          </div>
          <a
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-zinc-950 text-white shadow hover:bg-primary/90 h-9 px-4 py-2 mt-4 w-full gap-x-2'
            href={twitterShareLink}
          >
            <svg
              stroke='currentColor'
              fill='currentColor'
              strokeWidth='0'
              viewBox='0 0 512 512'
              height='1em'
              width='1em'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z'></path>
            </svg>
            Share to Twitter
          </a>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default ShareArticle
