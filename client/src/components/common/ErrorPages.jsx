import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const NotFoundPage = () => (
  <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
    <h1 className="text-9xl font-black text-gray-200">404</h1>
    <h2 className="text-3xl font-bold text-gray-900 mt-4">Page Not Found</h2>
    <p className="text-gray-500 mt-2 max-w-md">The page you are looking for doesn't exist or has been moved.</p>
    <Link to="/" className="mt-8">
      <Button>Return Home</Button>
    </Link>
  </div>
);

export const ForbiddenPage = () => (
  <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
    <div className="text-6xl mb-4">⛔</div>
    <h2 className="text-3xl font-bold text-gray-900">Access Denied</h2>
    <p className="text-gray-500 mt-2 max-w-md">You do not have permission to view this page or perform this action.</p>
    <Link to="/dashboard" className="mt-8">
      <Button>Back to Dashboard</Button>
    </Link>
  </div>
);

export const ServerErrorPage = () => (
  <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
    <div className="text-6xl mb-4">🔧</div>
    <h2 className="text-3xl font-bold text-gray-900">System Error</h2>
    <p className="text-gray-500 mt-2 max-w-md">Our servers encountered an unexpected issue. Please try again later.</p>
    <Button onClick={() => window.location.reload()} className="mt-8">Refresh Page</Button>
  </div>
);
