import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { ImageIcon, X } from 'lucide-react'

interface ViewMemoryDialogProps {
  memory: {
    text: string
    images?: string[]
  } | null
  open: boolean
  onClose: () => void
}

export default function ViewMemoryDialog({
  memory,
  open,
  onClose,
}: ViewMemoryDialogProps) {
  if (!memory) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Memory Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <p className="text-gray-800">{memory.text}</p>

          {memory.images && memory.images.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {memory.images.map((imgUrl, idx) => (
                <img
                  key={idx}
                  src={imgUrl}
                  alt="Memory"
                  className="w-32 h-32 object-cover rounded-md border"
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <ImageIcon size={16} /> No images
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
