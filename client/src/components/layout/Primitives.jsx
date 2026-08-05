import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Section = ({ id, className, children, container = true }) => {
  return (
    <section id={id} className={twMerge(clsx('py-16 md:py-24', className))}>
      {container ? <Container>{children}</Container> : children}
    </section>
  );
};

export const Container = ({ className, children }) => {
  return (
    <div className={twMerge(clsx('container mx-auto px-4 md:px-6 max-w-7xl', className))}>
      {children}
    </div>
  );
};

export const Stack = ({ className, children, spacing = 'md' }) => {
  const spacings = {
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8',
    xl: 'space-y-12'
  };
  return (
    <div className={twMerge(clsx('flex flex-col', spacings[spacing], className))}>
      {children}
    </div>
  );
};

export const Grid = ({ className, children, cols = 1, gap = 'md' }) => {
  const gaps = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12'
  };
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };
  return (
    <div className={twMerge(clsx('grid', gaps[gap], gridCols[cols], className))}>
      {children}
    </div>
  );
};
