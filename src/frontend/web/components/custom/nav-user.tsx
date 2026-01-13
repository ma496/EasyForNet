import Link from 'next/link'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { signout } from '@/store/slices/authSlice'
import { useRouter } from 'next/navigation'
import { getTranslation } from '@/i18n'
import { User, LogOut, Lock } from 'lucide-react'
import Dropdown, { DropdownRef } from '../dropdown'
import { useEffect, useRef, useState } from 'react'
import { useLazyFileGetQuery } from '@/store/api/file-management/files/files-api'
import { useSignoutMutation } from '@/store/api/identity/account/account-api'

const NavUser = () => {
  const { user } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { t } = getTranslation()
  const isRtl = useAppSelector((state) => state.theme.rtlClass) === 'rtl'
  const dropdownRef = useRef<DropdownRef>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>()
  const [fetchAvatar] = useLazyFileGetQuery()

  const handleLinkClick = () => {
    if (dropdownRef.current) {
      dropdownRef.current.close()
    }
  }

  const [logoutApi] = useSignoutMutation()

  const logoutAction = async () => {
    await logoutApi()
    dispatch(signout())
    router.push('/signin')
  }

  useEffect(() => {
    let objectUrl: string | undefined
    const loadAvatar = async () => {
      if (user?.image) {
        const result = await fetchAvatar({ fileName: user.image })
        if (result.data) {
          const blob = result.data as Blob
          objectUrl = URL.createObjectURL(blob)
          setAvatarUrl(objectUrl)
        }
      } else {
        setAvatarUrl(undefined)
      }
    }
    loadAvatar()
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [user?.image, fetchAvatar])

  return (
    <div className="dropdown w-9 h-9">
      <Dropdown
        ref={dropdownRef}
        placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
        btnClassName="block w-9 h-9 p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
        button={
          avatarUrl ? (
            <img className="w-5 h-5 rounded-full object-cover saturate-50 group-hover:saturate-100" src={avatarUrl} alt="userProfile" />
          ) : (
            <User className="w-5 h-5 rounded-full object-cover saturate-50 group-hover:saturate-100" />
          )
        }
      >
        <ul className="w-[230px] py-0! font-semibold text-dark dark:text-white-light/90">
          <li>
            <div className="flex items-center px-4 py-4">
              <img className="h-9 w-9 rounded-full object-cover saturate-50 group-hover:saturate-100" src={avatarUrl ?? '/assets/images/default-avatar.svg'} alt="userProfile" />
              <div className="truncate ltr:pl-4 rtl:pr-4">
                <h4 className="text-base">{user?.username ? `${user?.username}` : ''}</h4>
                <button type="button" className="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white">
                  {user?.email}
                </button>
              </div>
            </div>
          </li>
          <li>
            <Link href="/app/profile" className="dark:hover:text-white" onClick={handleLinkClick}>
              <User className="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
              {t('profile')}
            </Link>
          </li>
          <li>
            <Link href="/app/change-password" className="dark:hover:text-white" onClick={handleLinkClick}>
              <Lock className="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
              {t('change_password')}
            </Link>
          </li>
          <li className="cursor-pointer border-t border-white-light dark:border-white-light/10">
            <a className="py-3! text-danger" onClick={logoutAction}>
              <LogOut className="h-4.5 w-4.5 shrink-0 rotate-90 ltr:mr-2 rtl:ml-2" />
              {t('sign_out')}
            </a>
          </li>
        </ul>
      </Dropdown>
    </div>
  )
}

export default NavUser
