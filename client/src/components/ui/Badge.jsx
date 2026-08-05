import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const variants = {
  default: 'bg-gray-100 text-gray-800',
  primary: 'bg-emerald-100 text-emerald-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  error: 'bg-red-100 text-red-800',
  outline: 'text-gray-800 border border-gray-200',
};

export const Badge = ({ className, variant = 'default', children, ...props }) => {
  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          variants[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
};
