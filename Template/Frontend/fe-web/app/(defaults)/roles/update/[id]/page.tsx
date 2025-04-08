import { Metadata } from 'next';
import React from 'react';
import { RoleUpdateForm } from './_components/role-update-form';

export const metadata: Metadata = {
  title: 'Update Role',
};

interface RoleUpdatePageProps {
  params: {
    id: string;
  };
}

const RoleUpdate = ({ params }: RoleUpdatePageProps) => {
  return (
    <div className='flex justify-center items-center'>
      <RoleUpdateForm roleId={params.id} />
    </div>
  );
};

export default RoleUpdate;
