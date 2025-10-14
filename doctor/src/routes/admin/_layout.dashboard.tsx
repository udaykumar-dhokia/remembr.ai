import type { RootState } from '@/store/store'
import { createFileRoute } from '@tanstack/react-router'
import { useSelector } from 'react-redux'

export const Route = createFileRoute('/admin/_layout/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  return <div>Hello "/_admin/admin"!</div>
}
