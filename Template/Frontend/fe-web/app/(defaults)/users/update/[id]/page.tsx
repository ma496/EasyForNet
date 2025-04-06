import { Metadata } from 'next';
import React from 'react';
import { UserUpdateForm } from './_components/user-update-form';

export const metadata: Metadata = {
  title: 'Update User',
};

interface UserUpdatePageProps {
  params: {
    id: string;
  };
}

const UserUpdate = ({ params }: UserUpdatePageProps) => {
  return (
    <div className='flex justify-center items-center'>
      <UserUpdateForm userId={params.id} />
    </div>
  );
};

export default UserUpdate;
