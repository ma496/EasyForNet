import { Metadata } from 'next';
import React from 'react';
import { UserCreateForm } from './_components/user-create-form';

export const metadata: Metadata = {
  title: 'Create User',
};

const UserCreate = () => {
  return <div className='flex justify-center items-center'>
    <UserCreateForm />
  </div>;
};

export default UserCreate;
