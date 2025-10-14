import Footer from '@/components/custom/Footer'
import Header from '@/components/custom/Header'
import Hero from '@/components/custom/Hero'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <>
      <Header />
      <Hero />
      <Outlet />
      <Footer />
    </>
  )
}
