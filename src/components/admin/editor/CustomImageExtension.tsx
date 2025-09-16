import { Image } from '@tiptap/extension-image'
import { Plugin, PluginKey } from '@tiptap/pm/state'

interface ImageDropHandler {
  onImageDrop: (files: File[], view: any) => void
}

// Store handler reference
let imageDropHandler: ImageDropHandler | null = null

export function setImageDropHandler(handler: ImageDropHandler) {
  imageDropHandler = handler
}

export function clearImageDropHandler() {
  imageDropHandler = null
}

export const CustomImage = Image.extend({
  addProseMirrorPlugins() {
    return [
      ...(this.parent?.() || []),
      new Plugin({
        key: new PluginKey('image-drag-drop'),
        props: {
          handleDOMEvents: {
            drop: (view, event) => {
              const dropEvent = event as DragEvent
              if (!dropEvent.dataTransfer?.files.length) return false

              const files = Array.from(dropEvent.dataTransfer.files).filter(
                (file) => file.type.startsWith('image/')
              )

              if (files.length === 0) return false

              event.preventDefault()
              event.stopPropagation()

              // Use the registered handler
              if (imageDropHandler) {
                imageDropHandler.onImageDrop(files, view)
              }

              return true
            },
          },
        },
      }),
    ]
  },
})
