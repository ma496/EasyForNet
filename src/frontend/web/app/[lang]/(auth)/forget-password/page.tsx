import { Metadata } from 'next'
import { ForgetPasswordForm } from './_components/forget-password-form'
import LanguageDropdown from '@/components/custom/language-dropdown'
import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'

export const metadata: Metadata = {
  title: 'Forget Password',
}

const ForgetPassword = async ({ params }: { params: Promise<{ lang: string }> }) => {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  return (
    <div>
      <div className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-6 py-10 sm:px-16 dark:bg-[#060818]">
        <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
          <div className="relative flex flex-col justify-center rounded-md bg-white/60 px-6 py-20 backdrop-blur-lg lg:min-h-[758px] dark:bg-black/50">
            <div className="absolute end-6 top-6">
              <LanguageDropdown />
            </div>
            <div className="mx-auto w-full max-w-[440px]">
              <div className="mb-10">
                <h1 className="text-3xl leading-snug! font-extrabold text-primary uppercase md:text-4xl">{dict.page_forgetPassword_title}</h1>
                <p className="text-base leading-normal font-bold text-white-dark">{dict.page_forgetPassword_description}</p>
              </div>
              <ForgetPasswordForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgetPassword
