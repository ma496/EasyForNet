import { Metadata } from 'next';
import React from 'react';
import { UpdateProfile } from './_components/update-profile';

export const metadata: Metadata = {
  title: 'Profile',
};

const Profile = () => {
  return (
    <div className='flex justify-center items-center'>
      <UpdateProfile />
    </div>
  );
};

export default Profile;
