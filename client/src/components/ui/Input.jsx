import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Search } from 'lucide-react';

export const Input = React.forwardRef(({ className, type = 'text', error, ...props }, ref) => {
  const isSearch = type === 'search';

  return (
    <div className="relative w-full">
      {isSearch && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
      )}
      <input
        type={type}
        className={twMerge(
          clsx(
            'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-small placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-shadow',
            isSearch && 'pl-10',
            error && 'border-error focus:ring-error',
            className
          )
        )}
        ref={ref}
        {...props}
      />
      {error && <span className="text-caption text-error mt-1">{error}</span>}
    </div>
  );
});
Input.displayName = 'Input';

export const Textarea = React.forwardRef(({ className, error, ...props }, ref) => {
  return (
    <div className="w-full">
      <textarea
        className={twMerge(
          clsx(
            'flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-small placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-shadow',
            error && 'border-error focus:ring-error',
            className
          )
        )}
        ref={ref}
        {...props}
      />
      {error && <span className="text-caption text-error mt-1">{error}</span>}
    </div>
  );
});
Textarea.displayName = 'Textarea';

export const Checkbox = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      type="checkbox"
      ref={ref}
      className={twMerge(
        clsx(
          'h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
          className
        )
      )}
      {...props}
    />
  );
});
Checkbox.displayName = 'Checkbox';

export const Radio = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      type="radio"
      ref={ref}
      className={twMerge(
        clsx(
          'h-4 w-4 rounded-full border-gray-300 text-primary focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
          className
        )
      )}
      {...props}
    />
  );
});
Radio.displayName = 'Radio';

export const Toggle = React.forwardRef(({ className, checked, onChange, ...props }, ref) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange && onChange(!checked)}
      className={twMerge(
        clsx(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          checked ? 'bg-primary' : 'bg-gray-200',
          className
        )
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={clsx(
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
          checked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  );
});
Toggle.displayName = 'Toggle';
