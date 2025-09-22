import { Metadata } from 'next';
import React from 'react';
import { RoleTable } from './_components/role-table';

export const metadata: Metadata = {
  title: 'Roles',
};

const Roles = () => {
  return <div className='flex justify-center items-center'>
    <RoleTable />
  </div>;
};

export default Roles;
