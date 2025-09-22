import { Metadata } from 'next';
import React from 'react';
import { RoleCreateForm } from './_components/role-create-form';

export const metadata: Metadata = {
  title: 'Create Role',
};

const RoleCreate = () => {
  return <div className='flex justify-center items-center'>
    <RoleCreateForm />
  </div>;
};

export default RoleCreate;
