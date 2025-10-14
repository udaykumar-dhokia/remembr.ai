import { Button } from '../ui/button'

const Hero = () => {
  return (
    <>
      <section className="bg-white lg:grid lg:h-screen lg:place-content-center">
        <div className="mx-auto w-screen max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-prose text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Helping Memories Shine Brighter Every Day
            </h1>

            <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed">
              A compassionate reminder platform designed to support dementia
              patients in recalling cherished moments and daily tasks with
              gentle, continuous prompts.
            </p>

            <div className="mt-4 flex justify-center gap-4 sm:mt-6">
              <Button className="rounded-none border border-black bg-black px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-black/75">
                Get Started
              </Button>

              <Button
                variant={'outline'}
                className="rounded-none border border-gray-200 px-5 py-3 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Hero
