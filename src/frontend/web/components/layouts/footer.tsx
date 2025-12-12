import { getTranslation } from '@/i18n'

const Footer = () => {
  const { t } = getTranslation()
  return (
    <div className="mt-auto px-6 pt-0 text-center sm:ltr:text-left sm:rtl:text-right dark:text-white-dark">
      © {new Date().getFullYear()}. {t('footer_copyright')}
    </div>
  )
}

export default Footer
