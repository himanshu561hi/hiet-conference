import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import { ROUTES } from '../../constants/routes';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const Login = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || ROUTES.PRIVATE.DASHBOARD;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      const response = await api.post('/v1/auth/login', data);
      
      login(response.data);
      navigate(from, { replace: true });
    } catch (err) {
      if (err.response?.data?.notVerified) {
        sessionStorage.setItem('verify_email', data.email);
        navigate(ROUTES.AUTH.VERIFY_EMAIL);
      } else {
        setError(err.response?.data?.message || 'Invalid email or password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Welcome Back</h2>
      
      {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <Link to={ROUTES.AUTH.FORGOT_PASSWORD} className="text-xs font-bold text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <input 
            type="password"
            {...register('password')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <div className="flex items-center">
          <input type="checkbox" id="remember" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
          <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>

        <Button type="submit" className="w-full h-12 mt-2" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Log In'}
        </Button>
      </form>

      <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
        💡 <strong>Tip:</strong> Your password is <code className="bg-white px-1 rounded">firstName + last 4 digits of mobile</code> (e.g. <code className="bg-white px-1 rounded">himanshu0670</code>). Check your registration email.
      </div>
    </div>
  );
};
