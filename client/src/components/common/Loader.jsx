import React from 'react';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Spinner = ({ className, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className={twMerge(clsx('animate-spin text-primary', sizeClasses[size], className))} />
    </div>
  );
};

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={twMerge(clsx('animate-pulse rounded-md bg-gray-200', className))}
      {...props}
    />
  );
};

export const PageLoader = () => (
  <div className="flex h-[50vh] items-center justify-center">
    <Spinner size="lg" />
  </div>
);
