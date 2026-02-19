import { LocalizedLink } from '@/components/localized-link'
import { Github } from 'lucide-react'
import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'

const CTA = async ({ lang }: { lang: Locale }) => {
  const dict = await getDictionary(lang)

  return (
    <div className="relative isolate overflow-hidden bg-gray-900 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <div className="max-w-xl lg:max-w-lg">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {dict.page.home.cta.title}
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-300">
              {dict.page.home.cta.description}
            </p>
            <div className="mt-6 flex max-w-md gap-x-4">
              <LocalizedLink
                href="https://github.com/ma496/EasyForNet"
                target="_blank"
                className="flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {dict.page.home.cta.button}
              </LocalizedLink>
            </div>
          </div>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                <Github className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <dt className="mt-4 font-semibold text-white">{dict.page.home.cta.opensource}</dt>
              <dd className="mt-2 leading-7 text-gray-400">
                {dict.page.home.cta.license}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}

export default CTA
