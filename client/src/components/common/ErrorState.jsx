import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

export const ErrorState = ({ title = "Something went wrong", message = "An unexpected error occurred.", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
      <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
        <AlertCircle className="h-6 w-6 text-error" />
      </div>
      <h3 className="text-h4 font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-sm">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  );
};
