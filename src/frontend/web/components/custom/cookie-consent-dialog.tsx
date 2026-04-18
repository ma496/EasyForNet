'use client'

import { Transition, TransitionChild } from '@headlessui/react'
import { Fragment } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/i18n'

interface CookieConsentDialogProps {
  isOpen: boolean
  onAccept: () => void
  onDecline: () => void
}

const CookieConsentDialog = ({ isOpen, onAccept, onDecline }: CookieConsentDialogProps) => {
  const { t } = useTranslation()

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <div className="fixed inset-0 z-50 flex items-end justify-center">
        {/* Overlay */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black/60"
            aria-hidden="true"
            onClick={onDecline}
          />
        </TransitionChild>

        {/* Bottom Sheet */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-full"
          enterTo="opacity-100 translate-y-0"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-full"
        >
          <div className="relative w-full panel bg-white dark:bg-gray-800 p-5 rounded-t-lg shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-bold">{t('cookieConsent.title')}</div>
              <button
                onClick={onDecline}
                type="button"
                className="cursor-pointer text-white-dark transition-colors duration-200 hover:text-dark ltr:ml-4 rtl:mr-4"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <p className="mb-4 text-base font-medium text-[#1f2937] dark:text-white-dark/70">
              {t('cookieConsent.description')}
            </p>

            <div className="flex items-center justify-end gap-2">
              <Button variant="outline-secondary" onClick={onDecline}>
                {t('cookieConsent.decline')}
              </Button>
              <Button onClick={onAccept}>
                {t('cookieConsent.accept')}
              </Button>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Transition>
  )
}

export default CookieConsentDialog
