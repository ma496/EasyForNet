import { useTranslation } from '@/i18n'

const Footer = () => {
  const { t } = useTranslation()
  return (
    <div className="mt-auto px-6 pt-0 text-center sm:ltr:text-left sm:rtl:text-right dark:text-white-dark">
      © {new Date().getFullYear()}. {t('brand.name')}. {t('common.allRightsReserved')}
    </div>
  )
}

export default Footer
