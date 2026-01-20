'use client';

import React from 'react';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark';
export type BadgeType = 'solid' | 'outline';

interface IBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  type?: BadgeType;
  className?: string;
}

const Badge: React.FC<IBadgeProps> = ({
  children,
  variant = 'primary',
  type = 'solid',
  className = '',
}) => {
  const getVariantClass = () => {
    if (type === 'outline') {
      return `badge-outline-${variant}`;
    }
    return `badge-${variant}`;
  };

  return (
    <span className={`badge ${getVariantClass()} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
