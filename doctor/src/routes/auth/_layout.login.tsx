import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/_layout/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/auth/_layout/login"!</div>
}
