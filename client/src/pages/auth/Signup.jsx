import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { ROUTES } from '../../constants/routes';
import { Button } from '../../components/ui/Button';

// Password Validation Rule
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character');

const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().min(10, 'Mobile number must be at least 10 digits'),
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const Signup = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      const response = await api.post('/v1/auth/signup', {
        fullName: data.fullName,
        email: data.email,
        mobile: data.mobile,
        password: data.password
      });
      
      // Store email temporarily to verify
      sessionStorage.setItem('verify_email', response.data.email);
      navigate(ROUTES.AUTH.VERIFY_EMAIL);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create an Account</h2>
      
      {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input 
            {...register('fullName')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
          {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input 
            type="email"
            {...register('email')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
          <input 
            type="tel"
            {...register('mobile')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
          {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            type="password"
            {...register('password')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input 
            type="password"
            {...register('confirmPassword')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        <Button type="submit" className="w-full h-12 mt-2" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to={ROUTES.AUTH.LOGIN} className="font-bold text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};
