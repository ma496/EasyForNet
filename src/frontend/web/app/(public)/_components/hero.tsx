import Link from 'next/link'
import { ArrowRight, Code2 } from 'lucide-react'

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-black">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent opacity-50"></div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="pb-8 pt-20 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
          <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="text-center">
              <div className="inline-flex items-center rounded-full border border-gray-200 bg-white/50 px-3 py-1 text-sm font-medium text-gray-800 backdrop-blur-sm dark:border-gray-800 dark:bg-white/5 dark:text-gray-200 mb-6">
                <span className="flex h-2 w-2 rounded-full bg-primary me-2"></span>
                Open Source .NET & Next.js Template
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                <span className="block">Focus on</span>
                <span className="block text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">Business Logic</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl">
                Stop wasting time on boilerplate. A production-ready foundation with Authentication, Permissions, and Background Jobs pre-configured.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center">
                <div className="rounded-md shadow">
                  <Link
                    href="/signin"
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-primary px-8 py-3 text-base font-medium text-white hover:bg-primary/90 md:py-4 md:text-lg transition-all hover:scale-105"
                  >
                    Signin
                    <ArrowRight className="ms-2 h-5 w-5" />
                  </Link>
                </div>
                <div className="mt-3 sm:ms-3 sm:mt-0">
                  <Link
                    href="https://github.com/ma496/EasyForNet"
                    target="_blank"
                    className="flex w-full items-center justify-center rounded-md border border-gray-200 bg-white px-8 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 md:py-4 md:text-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 transition-all hover:scale-105"
                  >
                    <Code2 className="me-2 h-5 w-5" />
                    View Source
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Hero
