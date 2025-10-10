'use client'

import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface DeleteModalProps {
  itemName: string
  onDelete?: () => Promise<void>
  trigger: React.ReactNode
  description?: string
}

export default function DeleteModal({
  itemName,
  onDelete,
  trigger,
  description,
}: DeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleDelete = async () => {
    if (!onDelete) {
      setDialogOpen(false)
      return
    }

    try {
      setIsDeleting(true)
      await onDelete()
      setDialogOpen(false)
    } catch (error) {
      toast.message(`Failed to delete ${itemName}.`, {
        description:
          typeof error === 'object' && error && 'message' in error
            ? (error as { message: string }).message
            : 'An error occurred',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {description || (
              <>
                This action cannot be undone. It will permanently delete{' '}
                <span className='font-semibold'>“{itemName}”</span>.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isDeleting}
            onClick={() => setDialogOpen(false)}
          >
            Cancel
          </AlertDialogCancel>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={isDeleting}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {isDeleting ? (
              <>
                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
