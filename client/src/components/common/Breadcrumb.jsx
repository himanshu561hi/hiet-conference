import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
            {item.href ? (
              <Link
                to={item.href}
                className="inline-flex items-center hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
