'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PostsList from './PostsList'

export default function StoriesTabs() {
  const [activeTab, setActiveTab] = useState('published')

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
      <TabsList className="w-full p-0 bg-background justify-start border-b rounded-none">
        <TabsTrigger
          value='published'
          className='rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary'
        >
          Published
        </TabsTrigger>
        <TabsTrigger
          value='drafts'
          className='rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary'
        >
          Drafts
        </TabsTrigger>
      </TabsList>

      <TabsContent value='published' className='space-y-4'>
        <PostsList status='PUBLISHED' />
      </TabsContent>

      <TabsContent value='drafts' className='space-y-4'>
        <PostsList status='DRAFT' />
      </TabsContent>
    </Tabs>
  )
}
