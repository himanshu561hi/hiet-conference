import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={twMerge(clsx('w-full caption-bottom text-sm', className))}
      {...props}
    />
  </div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={twMerge(clsx('[&_tr]:border-b', className))} {...props} />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={twMerge(clsx('[&_tr:last-child]:border-0', className))}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={twMerge(
      clsx(
        'border-b border-gray-200 transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-50',
        className
      )
    )}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={twMerge(
      clsx(
        'h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0',
        className
      )
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={twMerge(
      clsx('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)
    )}
    {...props}
  />
));
TableCell.displayName = 'TableCell';

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
};
