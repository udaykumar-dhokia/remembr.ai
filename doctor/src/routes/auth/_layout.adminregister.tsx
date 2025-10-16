import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import axiosInstance from '@/utils/axios'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { LoaderCircle } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/auth/_layout/adminregister')({
  component: AdminRegister,
})

function AdminRegister() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

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
      }
      await axiosInstance.post('/auth/doctor/register', payload)
      navigate({ to: '/admin/dashboard' })
    } catch (error: any) {
      setError(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="min-h-[70vh] flex justify-center items-center">
        <div className="space-y-4 w-[25vw] border p-6 border-dashed">
          <h1 className="font-bold text-xl">Admin Register</h1>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={name}
              placeholder="Dr. Maria"
              className="rounded-none"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value={email}
              placeholder="admin@example.com"
              className="rounded-none"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              value={password}
              placeholder="********"
              className="rounded-none"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <div className="">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          <div className="">
            <Button
              onClick={handleRegister}
              disabled={!email || !password || !name}
              className="w-full rounded-none"
            >
              {loading ? <LoaderCircle /> : 'Continue'}
            </Button>
          </div>
          <div className="">
            <h1>
              Already registered?{' '}
              <Link to="/auth/adminlogin">
                <strong>Login Now</strong>
              </Link>
            </h1>
          </div>
        </div>
      </div>
    </>
  )
}
