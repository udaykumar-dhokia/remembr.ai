import Footer from '@/components/custom/Footer'
import Header from '@/components/custom/Header'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <div className="">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </>
  )
}
