'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2, Save, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { countWords } from '@/lib/word-count'
import {
  DEFAULT_HERO_TAGLINE,
  HERO_TAGLINE_MAX_WORDS,
  HERO_TAGLINE_MIN_WORDS,
} from '@/lib/home-content'
import {
  heroTaglineSchema,
  type HeroTaglineFormValues,
} from '@/lib/validation'

interface HeroTaglineEditorProps {
  initialTagline?: string | null
  onCancel: () => void
  onSaved: (tagline: string) => void
}

export default function HeroTaglineEditor({
  initialTagline,
  onCancel,
  onSaved,
}: HeroTaglineEditorProps) {
  const form = useForm<HeroTaglineFormValues>({
    resolver: zodResolver(heroTaglineSchema),
    defaultValues: {
      heroTagline: initialTagline?.trim() || DEFAULT_HERO_TAGLINE,
    },
  })

  const tagline = form.watch('heroTagline')
  const wordCount = countWords(tagline ?? '')

  const onSubmit = async (values: HeroTaglineFormValues) => {
    try {
      await axios.put('/api/profile', { heroTagline: values.heroTagline.trim() })
      toast.success('Hero text updated')
      onSaved(values.heroTagline.trim())
      onCancel()
    } catch (err) {
      console.error('Failed to save hero tagline', err)
      toast.error('Failed to save hero text')
    }
  }

  const isSubmitting = form.formState.isSubmitting
  const isValid =
    wordCount >= HERO_TAGLINE_MIN_WORDS && wordCount <= HERO_TAGLINE_MAX_WORDS

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
        <FormField
          control={form.control}
          name='heroTagline'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  rows={4}
                  className='text-sm lg:text-base leading-relaxed resize-y min-h-[6rem]'
                  aria-label='Hero introduction'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <p className='text-sm text-muted-foreground'>
            {wordCount} / {HERO_TAGLINE_MAX_WORDS} words
            {wordCount < HERO_TAGLINE_MIN_WORDS &&
              ` (minimum ${HERO_TAGLINE_MIN_WORDS})`}
          </p>
          <div className='flex items-center gap-2'>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={onCancel}
              disabled={isSubmitting}
              className='gap-1'
            >
              <X className='w-4 h-4' />
              Cancel
            </Button>
            <Button
              type='submit'
              size='sm'
              disabled={isSubmitting || !isValid}
              className='gap-1 bg-black text-white hover:bg-beige hover:text-foreground'
            >
              {isSubmitting ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <Save className='w-4 h-4' />
              )}
              Save
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
