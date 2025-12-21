'use client'

import { useAppSelector } from '@/store/hooks'
import { useRouter } from 'next/navigation'
import { getTranslation } from '@/i18n'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

const UnauthorizedPage = () => {
  const router = useRouter()
  const { t } = getTranslation()
  const authState = useAppSelector((state) => state.auth)

  const handleBack = () => {
    const isPublic = authState.user?.roles?.some((role) => role.name === 'Public')
    if (isPublic) {
      router.push('/')
    } else {
      router.push('/app')
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="px-6 py-16 text-center font-semibold before:absolute before:left-1/2 before:container before:aspect-square before:-translate-x-1/2 before:rounded-full before:bg-[linear-gradient(180deg,#4361EE_0%,rgba(67,97,238,0)_50.73%)] before:opacity-10 md:py-20">
        <div className="relative">
          <Image
            src="/assets/images/error/404-dark.svg"
            alt="403"
            width={500}
            height={500}
            className="dark-img mx-auto -mt-10 w-full max-w-xs object-cover md:-mt-14 md:max-w-xl"
            loading="eager"
          />
          <Image
            src="/assets/images/error/404-light.svg"
            alt="403"
            width={500}
            height={500}
            className="light-img mx-auto -mt-10 w-full max-w-xs object-cover md:-mt-14 md:max-w-xl"
            loading="eager"
          />
          <h2 className="mt-5 text-3xl font-bold dark:text-white">{t('403_error_title')}</h2>
          <p className="mt-5 text-base dark:text-white">{t('403_error_message')}</p>
          <Button
            onClick={handleBack}
            className="btn mx-auto mt-7! w-max border-0 btn-gradient uppercase shadow-none gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('back')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UnauthorizedPage
