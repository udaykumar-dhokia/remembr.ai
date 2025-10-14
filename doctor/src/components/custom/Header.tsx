import { Link } from '@tanstack/react-router'
import { Button } from '../ui/button'

export default function Header() {
  return (
    <>
      <header className="bg-white">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="md:flex md:items-center md:gap-12">
              <Link to="/" className="block text-black">
                <span className="sr-only">Home</span>
                <h1 className="text-2xl font-bold">remembr.ai</h1>
              </Link>
            </div>

            <div className="hidden md:block">
              <nav aria-label="Global">
                <ul className="flex items-center gap-6 text-sm">
                  <li>
                    <a
                      className="text-gray-500 transition hover:text-gray-500/75"
                      href="/"
                    >
                      Home{' '}
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-gray-500 transition hover:text-gray-500/75"
                      href="#"
                    >
                      About{' '}
                    </a>
                  </li>

                  <li>
                    <a
                      className="text-gray-500 transition hover:text-gray-500/75"
                      href="#"
                    >
                      Features{' '}
                    </a>
                  </li>

                  <li>
                    <a
                      className="text-gray-500 transition hover:text-gray-500/75"
                      href="#"
                    >
                      Working{' '}
                    </a>
                  </li>

                  <li>
                    <a
                      className="text-gray-500 transition hover:text-gray-500/75"
                      href="#"
                    >
                      Contact{' '}
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="sm:flex sm:gap-4">
                <Link to="/auth/login">
                  <Button className="rounded-none bg-black px-5 py-2.5 text-sm font-medium text-white shadow-sm cursor-pointer">
                    Login
                  </Button>
                </Link>

                <div className="hidden sm:flex">
                  <Button className="rounded-none bg-gray-100 px-5 py-2.5 text-sm font-medium text-black cursor-pointer">
                    Register
                  </Button>
                </div>
              </div>

              <div className="block md:hidden">
                <button className="rounded-sm bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
