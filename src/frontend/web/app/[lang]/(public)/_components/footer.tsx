import LanguageDropdown from '@/components/custom/language-dropdown'
import { getDictionary } from '@/i18n'
import { Locale } from '@/i18n'

const Footer = async ({ lang }: { lang: Locale }) => {
  const dict = await getDictionary(lang)

  return (
    <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center gap-6 md:order-2">
          <LanguageDropdown />
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-base text-gray-400">
            © {new Date().getFullYear()}. {dict.brand.name}. {dict.common.allRightsReserved}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
