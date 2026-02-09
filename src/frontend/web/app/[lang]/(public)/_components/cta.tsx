import { LocalizedLink } from '@/components/localized-link'
import { Github } from 'lucide-react'

const CTA = () => {
  return (
    <div className="relative isolate overflow-hidden bg-gray-900 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <div className="max-w-xl lg:max-w-lg">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Open Source & Community Driven
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-300">
              Join the community, contribute to the project, or fork it to start your next big idea.
            </p>
            <div className="mt-6 flex max-w-md gap-x-4">
              <LocalizedLink
                href="https://github.com/ma496/EasyForNet"
                target="_blank"
                className="flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Star on GitHub
              </LocalizedLink>
            </div>
          </div>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                <Github className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <dt className="mt-4 font-semibold text-white">Open Source</dt>
              <dd className="mt-2 leading-7 text-gray-400">
                MIT Licensed. Free to use for personal and commercial projects.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}

export default CTA
