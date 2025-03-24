import { Metadata } from 'next';
import React from 'react';
import { ChangePasswordForm } from './_components/change-password-form';

export const metadata: Metadata = {
  title: 'Change Password',
};

const ChangePassword = () => {
  return <div className='flex justify-center items-center'>
    <ChangePasswordForm />
  </div>;
};

export default ChangePassword;
