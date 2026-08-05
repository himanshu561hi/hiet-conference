import React from 'react';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const variants = {
  primary: 'bg-emerald-800 text-white hover:bg-emerald-900 active:bg-emerald-950 font-bold',
  secondary: 'bg-secondary text-white hover:bg-blue-800 active:bg-blue-900',
  outline: 'border border-primary text-primary hover:bg-emerald-50 active:bg-emerald-100',
  ghost: 'bg-transparent text-text hover:bg-surface active:bg-gray-200',
  danger: 'bg-error text-white hover:bg-red-700 active:bg-red-800',
};

const sizes = {
  sm: 'px-3 py-1.5 text-small',
  md: 'px-4 py-2 text-button',
  lg: 'px-6 py-3 text-body',
};

export const Button = React.forwardRef(({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )
      )}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
