import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoaderCircle, Plus } from 'lucide-react'
import axiosInstance from '@/utils/axios'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { addMemory } from '@/store/slices/patient.slice'

const AddMemoryDialog = () => {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { patient } = useSelector((state: RootState) => state.patientReducer)
  const { patients } = useSelector((state: RootState) => state.patientsReducer)
  const { admin } = useSelector((state: RootState) => state.adminReducer)
  const dispatch = useDispatch()

  const resetForm = () => {
    setText('')
    setImages([])
    setError('')
    setLoading(false)
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) resetForm()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    const files = e.target.files
    if (!files) return

    const fileArray = Array.from(files)
    if (fileArray.length + images.length > 5) {
      setError('You can upload a maximum of 5 images')
      return
    }

    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']
    const invalidFiles = fileArray.filter(
      (file) => !allowedTypes.includes(file.type),
    )
    if (invalidFiles.length > 0) {
      setError('Only PNG and JPG images are allowed')
      return
    }

    setImages((prev) => [...prev, ...fileArray])
  }

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError('Please enter some text for the memory')
      return
    }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('patient', patient?._id ?? '')
      formData.append('doctor', admin?._id ?? '')
      formData.append('text', text)
      images.forEach((imageFile) => formData.append('images', imageFile))

      const response = await axiosInstance.post(
        '/doctor/upload-memory',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )

      const newMemory = response.data.memory
      dispatch(addMemory(newMemory))
      setOpen(false)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus size={18} /> Add Memory
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Memory</DialogTitle>
          <DialogDescription>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="memory-text">Memory Text</Label>
                <textarea
                  id="memory-text"
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the memory..."
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="memory-images">Upload Images (max 5)</Label>
                <Input
                  type="file"
                  id="memory-images"
                  accept="image/png, image/jpg, image/jpeg"
                  multiple
                  onChange={handleImageChange}
                />
              </div>

              {images.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-2">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="relative w-24 h-24 border rounded-md overflow-hidden"
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`preview-${i}`}
                        className="object-cover w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-1 right-1 bg-red-600 rounded-full text-white w-5 h-5 flex items-center justify-center text-xs"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

              <Button
                onClick={handleSubmit}
                disabled={loading || !text.trim()}
                className="w-full flex justify-center items-center gap-2"
              >
                {loading ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  'Add Memory'
                )}
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default AddMemoryDialog
