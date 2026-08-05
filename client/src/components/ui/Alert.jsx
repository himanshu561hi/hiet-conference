import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';

const icons = {
  default: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  error: XCircle,
};

const variants = {
  default: 'bg-gray-50 text-gray-800 border-gray-200',
  success: 'bg-green-50 text-green-800 border-green-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
  error: 'bg-red-50 text-red-800 border-red-200',
};

const iconColors = {
  default: 'text-gray-500',
  success: 'text-green-500',
  warning: 'text-amber-500',
  error: 'text-red-500',
};

export const Alert = React.forwardRef(({ className, variant = 'default', title, children, ...props }, ref) => {
  const Icon = icons[variant];

  return (
    <div
      ref={ref}
      role="alert"
      className={twMerge(
        clsx(
          'relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:text-foreground [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11',
          variants[variant],
          className
        )
      )}
      {...props}
    >
      <Icon className={clsx('h-5 w-5', iconColors[variant])} />
      {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
      <div className="text-sm opacity-90">{children}</div>
    </div>
  );
});
Alert.displayName = 'Alert';
