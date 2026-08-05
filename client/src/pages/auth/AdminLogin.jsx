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

export const AdminLogin = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = ROUTES.PRIVATE.ADMIN_DASHBOARD || '/admin/dashboard';

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      const response = await api.post('/v1/auth/admin-login', data);
      
      login(response.data);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-red-50 p-8 text-center border-b border-red-100">
        <h2 className="text-2xl font-black text-red-900 mb-2">Admin Portal</h2>
        <p className="text-red-700">Enter your credentials to access the admin dashboard.</p>
      </div>

      <div className="p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Admin Email</label>
            <input
              type="email"
              {...register('email')}
              className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all`}
              placeholder="admin@nexus2026.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-900">Password</label>
            </div>
            <input
              type="password"
              {...register('password')}
              className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all`}
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full py-3 bg-red-600 hover:bg-red-700 text-white" disabled={isLoading}>
            {isLoading ? 'Authenticating...' : 'Secure Login'}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">
            Not an admin?{' '}
            <Link to={ROUTES.AUTH.LOGIN} className="font-semibold text-primary hover:underline">
              User Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
