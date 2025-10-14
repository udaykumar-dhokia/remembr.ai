import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import axiosInstance from '@/utils/axios'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { LoaderCircle } from 'lucide-react'

export const Route = createFileRoute('/auth/_layout/adminlogin')({
  component: AdminLogin,
})

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) {
      return
    }
    try {
      setLoading(true)
      const payload = {
        email: email,
        password: password,
      }
      const user = await axiosInstance.post('/auth/doctor/login', payload)
      navigate({ to: '/admin/dashboard' })
      console.log(user)
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
          <h1 className="font-bold text-xl">Admin Login</h1>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              placeholder="admin@example.com"
              className="rounded-none"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              placeholder="********"
              className="rounded-none"
              type="password"
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
              className="w-full rounded-none"
              disabled={!email || !password}
              onClick={handleLogin}
            >
              {loading ? <LoaderCircle /> : 'Continue'}
            </Button>
          </div>
          <div className="">
            <h1>
              Not registered with us?{' '}
              <Link to="/auth/adminregister">
                <strong>Register Now</strong>
              </Link>
            </h1>
          </div>
        </div>
      </div>
    </>
  )
}
