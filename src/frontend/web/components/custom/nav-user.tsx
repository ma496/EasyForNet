import Link from 'next/link'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'
import { useRouter } from 'next/navigation'
import { getTranslation } from '@/i18n'
import { User, LogOut, Lock } from 'lucide-react'
import Dropdown, { DropdownRef } from '../dropdown'
import { useEffect, useRef, useState } from 'react'
import { useLazyFileGetQuery } from '@/store/api/file-management/files/files-api'

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

  const logoutAction = () => {
    dispatch(logout())
    router.push('/signin')
  }

  useEffect(() => {
    const loadAvatar = async () => {
      if (user?.image) {
        const result = await fetchAvatar({ fileName: user.image })
        const url = result.data
        setAvatarUrl(url)
      } else {
        setAvatarUrl(undefined)
      }
    }
    loadAvatar()
  }, [user?.image])

  return (
    <div className="dropdown">
      <Dropdown
        ref={dropdownRef}
        placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
        btnClassName="relative group block"
        button={<img className="h-9 w-9 rounded-full object-cover saturate-50 group-hover:saturate-100" src={avatarUrl ?? '/assets/images/default-avatar.svg'} alt="userProfile" />}
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
