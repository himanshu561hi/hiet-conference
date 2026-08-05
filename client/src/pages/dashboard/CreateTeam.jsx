import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { teamApi } from '../../api/team';
import { ROUTES } from '../../constants/routes';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const createTeamSchema = z.object({
  teamName: z.string()
    .min(3, 'Team Name must be at least 3 characters')
    .max(50, 'Team Name cannot exceed 50 characters'),
  teamType: z.enum(['Solo', 'Team'], {
    errorMap: () => ({ message: 'Please select a Team Type' })
  })
});

export const CreateTeam = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(createTeamSchema)
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');

      const response = await teamApi.createTeam(data);

      if (response.success) {
        toast.success(response.message || 'Team Created Successfully');
        // We will navigate to the newly built dashboard
        navigate(ROUTES.PRIVATE.DASHBOARD);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create team.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Team</h2>
        <p className="text-gray-500 mb-8">Set up your team to participate in NEXUS 2026. You will automatically become the Leader.</p>

        {error && <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
            <input
              {...register('teamName')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              placeholder="e.g. Tech Innovators"
            />
            {errors.teamName && <p className="mt-1 text-xs text-red-500">{errors.teamName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Participation Type</label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <label className="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none">
                <input
                  type="radio"
                  value="Solo"
                  {...register('teamType')}
                  className="sr-only peer"
                />
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className="block text-sm font-medium text-gray-900">Solo Participant</span>
                    <span className="mt-1 flex items-center text-xs text-gray-500">1 Member Only</span>
                  </span>
                </span>
                <span className="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent peer-checked:border-primary" aria-hidden="true"></span>
              </label>

              <label className="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none">
                <input
                  type="radio"
                  value="Team"
                  {...register('teamType')}
                  className="sr-only peer"
                />
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className="block text-sm font-medium text-gray-900">Team Participation</span>
                    <span className="mt-1 flex items-center text-xs text-gray-500">2-3 Members</span>
                  </span>
                </span>
                <span className="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent peer-checked:border-primary" aria-hidden="true"></span>
              </label>
            </div>
            {errors.teamType && <p className="mt-1 text-xs text-red-500">{errors.teamType.message}</p>}
          </div>

          <div className="pt-6 border-t border-gray-100">
            <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
              {isLoading ? 'Creating Team...' : 'Create Team & Continue'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
