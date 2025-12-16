'use client'

import { useVerifyEmailMutation } from '@/store/api/identity/account/account-api'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { getTranslation } from '@/i18n'
import Link from 'next/link'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

const VerifyEmailView = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const { t } = getTranslation()
  const router = useRouter()

  const [verifyEmail, { isLoading, isSuccess, isError, error }] = useVerifyEmailMutation()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const effectRan = useRef(false)

  useEffect(() => {
    if (effectRan.current) return

    if (token) {
      effectRan.current = true
      verifyEmail({ token })
        .unwrap()
        .then(() => setStatus('success'))
        .catch(() => setStatus('error'))
    } else {
      setStatus('error')
    }
  }, [token, verifyEmail])

  return (
    <div className="flex flex-col items-center justify-center space-y-6 text-center dark:text-white">
      {status === 'verifying' && (
        <>
          <Loader2 className="animate-spin h-12 w-12 text-primary" />
          <h2 className="text-xl font-semibold">{t('text_verifying_email') || 'Verifying your email...'}</h2>
        </>
      )}

      {status === 'success' && (
        <>
          <CheckCircle className="h-16 w-16 text-green-500" />
          <h2 className="text-2xl font-bold">{t('title_email_verified') || 'Email Verified!'}</h2>
          <p>{t('msg_email_verified_success') || 'Your email has been successfully verified. You can now sign in.'}</p>
          <Link href="/signin" className="btn btn-primary mt-4">
            {t('button_signin_now') || 'Sign In Now'}
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <XCircle className="h-16 w-16 text-red-500" />
          <h2 className="text-2xl font-bold">{t('title_verification_failed') || 'Verification Failed'}</h2>
          <p>{t('msg_verification_failed') || 'The verification link is invalid or has expired.'}</p>
          <Link href="/signin" className="btn btn-outline-primary mt-4">
            {t('button_back_to_signin') || 'Back to Sign In'}
          </Link>
        </>
      )}
    </div>
  )
}

export default VerifyEmailView
