import { getTranslationAsync } from '@/i18n';

const Footer = async () => {
  const { t } = await getTranslationAsync();
  return (
    <div className="p-6 pt-0 mt-auto text-center dark:text-white-dark ltr:sm:text-left rtl:sm:text-right">© {new Date().getFullYear()}. {t('footer_copyright')}</div>
  );
};

export default Footer;
