import React from 'react';
import { SearchX } from 'lucide-react';
import { Button } from '../ui/Button';

export const EmptyState = ({ title = "No data found", message, actionLabel, onAction, icon: Icon = SearchX }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="text-h4 font-semibold text-gray-900 mb-2">{title}</h3>
      {message && <p className="text-gray-500 mb-6 max-w-sm">{message}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
