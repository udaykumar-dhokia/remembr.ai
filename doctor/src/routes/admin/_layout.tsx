import { AdminSidebar } from '@/components/custom/AdminSidebar'
import Loader from '@/components/custom/Loader'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { setAdmin } from '@/store/slices/admin.slice'
import { setPatients } from '@/store/slices/patients.slice'
import { store } from '@/store/store'
import { persistAdmin, persistPatients } from '@/utils/auth'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/_layout')({
  beforeLoad: async () => {
    const admin = await persistAdmin()
    if (!admin) {
      throw redirect({
        to: '/auth/adminlogin',
      })
    }
    const patients = await persistPatients(admin._id)
    store.dispatch(setPatients(patients))
    store.dispatch(setAdmin(admin))
  },
  component: AdminLayout,
  pendingComponent: () => <Loader />,
})

function AdminLayout() {
  return (
    <>
      <SidebarProvider>
        <AdminSidebar />
        <main className="w-full">
          <SidebarTrigger />
          <Outlet />
        </main>
      </SidebarProvider>
    </>
  )
}
