import { Metadata } from 'next';
import React from 'react';
import { ChangePermissionsForm } from './_components/change-permissions-form';

export const metadata: Metadata = {
  title: 'Change Permissions',
};

interface ChangePermissionsPageProps {
  params: {
    id: string;
  };
}

const ChangePermissions = ({ params }: ChangePermissionsPageProps) => {
  return (
    <div className='flex justify-center items-center'>
      <ChangePermissionsForm roleId={params.id} />
    </div>
  );
};

export default ChangePermissions;
