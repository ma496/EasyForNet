import { Metadata } from 'next';
import React from 'react';
import { ResetPasswordForm } from './_components/reset-password-form';
import LanguageDropdown from '@/components/custom/language-dropdown';
import { getTranslation } from '@/i18n';

export const metadata: Metadata = {
  title: 'Reset Password',
};

const ResetPassword = () => {
  const { t } = getTranslation();

  return (
    <div>
      <div className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
        <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
          <div className="relative flex flex-col justify-center rounded-md bg-white/60 px-6 py-20 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px]">
            <div className="absolute end-6 top-6">
              <LanguageDropdown />
            </div>
            <div className="mx-auto w-full max-w-[440px]">
              <div className="mb-10">
                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">{t('page_resetPassword_title')}</h1>
                <p className="text-base font-bold leading-normal text-white-dark">{t('page_resetPassword_description')}</p>
              </div>
              <ResetPasswordForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
