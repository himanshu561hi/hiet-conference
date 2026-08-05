import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { ROUTES } from '../../constants/routes';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

const profileSchema = z.object({
  gender: z.string().optional(),
  institute: z.string().min(2, 'Institute name is required'),
  department: z.string().min(2, 'Department is required'),
  course: z.string().min(2, 'Course is required'),
  year: z.string().min(1, 'Year of study is required'),
  rollNumber: z.string().min(2, 'Roll number is required'),
  alternateEmail: z.string().email('Invalid email').optional().or(z.literal('')),
});

export const InitializeProfile = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema)
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      await api.post('/profile/initialize', data);
      navigate(ROUTES.PRIVATE.DASHBOARD);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initialize profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center py-12 px-4">
      <div className="max-w-2xl w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Complete Your Profile</h2>
          <p className="text-gray-500">Welcome, {user?.fullName}! Let's get to know you better before proceeding to the dashboard.</p>
        </div>

        {error && <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Institute / Organization</label>
              <input 
                {...register('institute')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                placeholder="e.g. Hi-Tech Institute of Engineering & Technology"
              />
              {errors.institute && <p className="mt-1 text-xs text-red-500">{errors.institute.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input 
                {...register('department')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                placeholder="e.g. Computer Science"
              />
              {errors.department && <p className="mt-1 text-xs text-red-500">{errors.department.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course / Degree</label>
              <input 
                {...register('course')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                placeholder="e.g. B.Tech"
              />
              {errors.course && <p className="mt-1 text-xs text-red-500">{errors.course.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year of Study</label>
              <select 
                {...register('year')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white"
              >
                <option value="">Select Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="Faculty">Faculty / Scholar</option>
              </select>
              {errors.year && <p className="mt-1 text-xs text-red-500">{errors.year.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Roll / ID Number</label>
              <input 
                {...register('rollNumber')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
              {errors.rollNumber && <p className="mt-1 text-xs text-red-500">{errors.rollNumber.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender (Optional)</label>
              <select 
                {...register('gender')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white"
              >
                <option value="">Prefer not to say</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Email (Optional)</label>
              <input 
                type="email"
                {...register('alternateEmail')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
              {errors.alternateEmail && <p className="mt-1 text-xs text-red-500">{errors.alternateEmail.message}</p>}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <Button type="submit" className="w-full h-14 text-lg" disabled={isLoading}>
              {isLoading ? 'Saving Profile...' : 'Complete Profile & Continue'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
