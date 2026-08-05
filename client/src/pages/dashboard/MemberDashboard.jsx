import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { requestsApi } from '../../api/requests';
import { invitesApi } from '../../api/invites';
import { teamApi } from '../../api/team';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { ROUTES } from '../../constants/routes';

export const MemberDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teamId, setTeamId] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [myInvites, setMyInvites] = useState([]);

  const fetchInvites = async () => {
    try {
      const res = await invitesApi.getMyInvites();
      if (res.success) setMyInvites(res.data);
    } catch (err) {
      console.error('Failed to fetch invites', err);
    }
  };

  useEffect(() => {
    // If user is already in a team, redirect to team dashboard
    teamApi.getMyTeam().then(res => {
      if (res.success) {
        navigate(ROUTES.PRIVATE.DASHBOARD || '/dashboard');
      }
    }).catch(err => {
      // Ignore TM_008 as it means they don't have a team, which is expected here
      fetchInvites();
    });
  }, [navigate]);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!teamId || !joinCode) {
      toast.error('Both Team ID and Join Code are required');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await requestsApi.sendRequest({ teamId, joinCode });
      if (response.success) {
        toast.success('Join Request sent successfully! Waiting for leader approval.');
        setTeamId('');
        setJoinCode('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send join request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.fullName}</h1>
        <p className="text-gray-500">You are not currently part of any active team.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Join Team Box */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Join an Existing Team</h3>
          <p className="text-sm text-gray-500 mb-6">Enter the Team ID and Join Code provided by your Team Leader.</p>
          
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team ID</label>
              <input 
                value={teamId}
                onChange={e => setTeamId(e.target.value)}
                placeholder="HIET/TM/XXXX"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none uppercase"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Join Code</label>
              <input 
                value={joinCode}
                onChange={e => setJoinCode(e.target.value)}
                placeholder="6-Character Code"
                maxLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none uppercase font-mono"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending Request...' : 'Send Join Request'}
            </Button>
          </form>
        </div>

        {/* Create Team Box */}
        <div className="bg-emerald-50 p-6 rounded-2xl shadow-sm border border-emerald-200 flex flex-col justify-center items-center text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Register for the Event</h3>
          <p className="text-sm text-gray-600 mb-6">
            Want to lead a research team or participate in NEXUS 2026? Use the official event registration portal to create your team and upload your paper.
          </p>
          <Button onClick={() => navigate('/register')} className="w-full max-w-xs bg-emerald-600 hover:bg-emerald-700 text-white">
            Register for Event
          </Button>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Pending Invitations</h3>
        {myInvites.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No pending invitations.</p>
        ) : (
          <div className="grid gap-4">
            {myInvites.map(invite => (
              <div key={invite._id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-gray-900">{invite.team?.teamName}</h4>
                  <p className="text-sm text-gray-500">From Leader: {invite.leader?.fullName} ({invite.leader?.email})</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={async () => {
                      try {
                        await invitesApi.acceptInvite(invite._id);
                        toast.success("Joined team successfully!");
                        navigate(ROUTES.PRIVATE.DASHBOARD || '/dashboard');
                      } catch (err) { toast.error(err.response?.data?.message || 'Failed to accept invite'); }
                    }}
                  >Accept</Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-500"
                    onClick={async () => {
                      try {
                        await invitesApi.rejectInvite(invite._id);
                        toast.success("Invite rejected.");
                        fetchInvites();
                      } catch (err) { toast.error(err.response?.data?.message || 'Action failed'); }
                    }}
                  >Reject</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
