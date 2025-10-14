import { AdminSidebar } from '@/components/custom/AdminSidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { setAdmin } from '@/store/slices/admin.slice'
import { store } from '@/store/store'
import { persistAdmin } from '@/utils/auth'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/_layout')({
  beforeLoad: async () => {
    const admin = await persistAdmin()
    if (!admin) {
      throw redirect({
        to: '/auth/adminlogin',
      })
    }
    store.dispatch(setAdmin(admin))
  },
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <>
      <SidebarProvider>
        <AdminSidebar />
        <main>
          <SidebarTrigger />
          <Outlet />
        </main>
      </SidebarProvider>
    </>
  )
}
