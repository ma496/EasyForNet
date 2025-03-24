import Link from 'next/link';
import IconUser from '@/components/icon/icon-user';
import IconLogout from '@/components/icon/icon-logout';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { getTranslation } from '@/i18n';
import IconLockDots from '@/components/icon/icon-lock-dots';
const NavUser = () => {
  const { user } = useAppSelector(state => state.auth)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { t } = getTranslation()

  const logoutAction = () => {
    dispatch(logout())
    router.push('/signin')
  }

  return (
    <ul className="w-[230px] !py-0 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
      <li>
        <div className="flex items-center px-4 py-4">
          <img className="h-9 w-9 rounded-full object-cover saturate-50 group-hover:saturate-100" src={user?.image?.imageBase64 ? `data:${user?.image.contentType};base64,${user?.image.imageBase64}` : '/assets/images/default-avatar.svg'} alt="userProfile" />
          <div className="truncate ltr:pl-4 rtl:pr-4">
            <h4 className="text-base">
              {user?.username ? `${user?.username}` : ''}
            </h4>
            <button type="button" className="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white">
              {user?.email}
            </button>
          </div>
        </div>
      </li>
      <li>
        <Link href="/profile" className="dark:hover:text-white">
          <IconUser className="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
          {t('profile')}
        </Link>
      </li>
      <li>
        <Link href="/change-password" className="dark:hover:text-white">
          <IconLockDots className="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
          {t('change_password')}
        </Link>
      </li>
      <li className="border-t border-white-light dark:border-white-light/10 cursor-pointer">
        <a className="!py-3 text-danger" onClick={logoutAction}>
          <IconLogout className="h-4.5 w-4.5 shrink-0 rotate-90 ltr:mr-2 rtl:ml-2" />
          {t('sign_out')}
        </a>
      </li>
    </ul>
  );
};

export default NavUser;
