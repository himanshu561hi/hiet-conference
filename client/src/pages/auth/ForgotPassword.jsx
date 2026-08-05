import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export const ForgotPassword = () => {
  return (
    <div className="w-full text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password</h2>
      <p className="text-sm text-gray-500 mb-8">Enter your email and we'll send you an OTP.</p>
      {/* Form will go here */}
      <div className="text-sm text-gray-500">
        Feature in development. <Link to={ROUTES.AUTH.LOGIN} className="text-primary hover:underline">Back to Login</Link>
      </div>
    </div>
  );
};
