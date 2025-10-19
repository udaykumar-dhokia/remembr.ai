import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { setPatients } from '@/store/slices/patients.slice'
import type { RootState } from '@/store/store'
import axiosInstance from '@/utils/axios'
import { Trash, LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

interface Props {
  id?: string
}

const DeletePatientDialog = ({ id }: Props) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const dispatch = useDispatch()
  const { patients } = useSelector((state: RootState) => state.patientsReducer)

  const handleDelete = async () => {
    if (!id) return
    try {
      setLoading(true)
      setError('')

      await axiosInstance.delete(`/patient/${id}`)

      const updatedPatients = patients?.filter((p) => p._id !== id) || []
      dispatch(setPatients(updatedPatients))

      setOpen(false)
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete patient')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer hover:bg-red-500 hover:text-white"
        >
          <Trash size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Patient</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this patient?
            <span className="block text-red-500 mt-1">
              This action cannot be undone.
            </span>
          </DialogDescription>

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="cursor-pointer"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              variant="destructive"
              className="cursor-pointer flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin" size={16} />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default DeletePatientDialog
