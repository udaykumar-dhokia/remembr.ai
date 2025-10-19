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
import { setPatients } from '@/store/slices/patients.slice'
import type { RootState } from '@/store/store'
import axiosInstance from '@/utils/axios'
import { LoaderCircle, Plus } from 'lucide-react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const AddPatientsDialog = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()

  const { admin } = useSelector((state: RootState) => state.adminReducer)
  const { patients } = useSelector((state: RootState) => state.patientsReducer)

  const handleRegister = async () => {
    if (!email || !password || !name) {
      return
    }
    try {
      setLoading(true)
      const payload = {
        name: name,
        email: email,
        password: password,
        doctor: admin?._id,
      }
      await axiosInstance.post('/auth/patient/register', payload)
      if (patients) {
        dispatch(setPatients([...patients, payload]))
      } else {
        dispatch(setPatients([payload]))
      }
      setOpen(false)
      setEmail('')
      setPassword('')
      setName('')
    } catch (error: any) {
      setError(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button className="flex items-center gap-2">
            <Plus size={18} /> Add Patient
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Patient</DialogTitle>
            <DialogDescription>
              <div className="py-4 space-y-3">
                <div className="space-y-1">
                  <Label>Name</Label>
                  <Input
                    placeholder="Jay"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="jay@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    placeholder="**********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && (
                  <div className="">
                    <p className="text-red-600">{error}</p>
                  </div>
                )}
              </div>
              <Button
                className="cursor-pointer"
                disabled={!email || !password || !name}
                onClick={handleRegister}
              >
                {loading ? <LoaderCircle /> : 'Continue'}
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddPatientsDialog
