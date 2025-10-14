import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/_layout/adminregister')({
  component: AdminRegister,
})

function AdminRegister() {
  return (
    <>
      <div className="min-h-[70vh] flex justify-center items-center">
        <div className="space-y-4 w-[25vw] border p-6 border-dashed">
          <h1 className="font-bold text-xl">Admin Register</h1>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input placeholder="Dr. Maria" className="rounded-none" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input placeholder="admin@example.com" className="rounded-none" />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input placeholder="********" className="rounded-none" />
          </div>
          <div className="">
            <Button className="w-full rounded-none">Continue</Button>
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
