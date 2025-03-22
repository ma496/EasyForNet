import IconCalendar from '@/components/icon/icon-calendar';
import IconCoffee from '@/components/icon/icon-coffee';
import IconDribbble from '@/components/icon/icon-dribbble';
import IconGithub from '@/components/icon/icon-github';
import IconMail from '@/components/icon/icon-mail';
import IconMapPin from '@/components/icon/icon-map-pin';
import IconPencilPaper from '@/components/icon/icon-pencil-paper';
import IconPhone from '@/components/icon/icon-phone';
import IconTwitter from '@/components/icon/icon-twitter';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

export const metadata: Metadata = {
  title: 'Profile',
};

const Profile = () => {
  return (
    <div className='flex flex-col gap-5'>
      {/* <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link href="#" className="text-primary hover:underline">
            Users
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>Profile</span>
        </li>
      </ul> */}
      <Breadcrumbs />
      <div className='flex justify-center items-center'>
        <div className="panel w-72 sm:w-96">
          <div className="mb-5 flex items-center justify-between">
            <h5 className="text-lg font-semibold dark:text-white-light">Profile</h5>
            <Link href="/users/user-account-settings" className="btn btn-primary rounded-full p-2 ltr:ml-auto rtl:mr-auto">
              <IconPencilPaper />
            </Link>
          </div>
          <div className="mb-5">
            <div className="flex flex-col items-center justify-center">
              <img src="/assets/images/profile-34.jpeg" alt="img" className="mb-5 h-24 w-24 rounded-full  object-cover" />
              <p className="text-xl font-semibold text-primary">Jimmy Turner</p>
            </div>
            <ul className="m-auto mt-5 flex max-w-[160px] flex-col space-y-4 font-semibold text-white-dark">
              <li className="flex items-center gap-2">
                <IconCoffee className="shrink-0" /> Web Developer
              </li>
              <li className="flex items-center gap-2">
                <IconCalendar className="shrink-0" />
                Jan 20, 1989
              </li>
              <li className="flex items-center gap-2">
                <IconMapPin className="shrink-0" />
                New York, USA
              </li>
              <li>
                <button className="flex items-center gap-2">
                  <IconMail className="h-5 w-5 shrink-0" />
                  <span className="truncate text-primary">jimmy@gmail.com</span>
                </button>
              </li>
              <li className="flex items-center gap-2">
                <IconPhone />
                <span className="whitespace-nowrap" dir="ltr">
                  +1 (530) 555-12121
                </span>
              </li>
            </ul>
            <ul className="mt-7 flex items-center justify-center gap-2">
              <li>
                <button className="btn btn-info flex h-10 w-10 items-center justify-center rounded-full p-0">
                  <IconTwitter className="h-5 w-5" />
                </button>
              </li>
              <li>
                <button className="btn btn-danger flex h-10 w-10 items-center justify-center rounded-full p-0">
                  <IconDribbble />
                </button>
              </li>
              <li>
                <button className="btn btn-dark flex h-10 w-10 items-center justify-center rounded-full p-0">
                  <IconGithub />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
