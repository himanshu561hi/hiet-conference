import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { brandingConfig } from '../config/branding';
import { ROUTES } from '../constants/routes';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 opacity-5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative w-full max-w-md z-10">
        <div className="text-center mb-8">
          <Link to={ROUTES.PUBLIC.HOME} className="inline-block text-3xl font-extrabold tracking-tight mb-2">
            NEXUS<span className="text-primary">2026</span>
          </Link>
          <p className="text-gray-500 text-sm">{brandingConfig.tagline}</p>
        </div>
        
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl shadow-xl border border-gray-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
