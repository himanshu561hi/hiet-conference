import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { teamApi } from '../../api/team';
import { teamManagementApi } from '../../api/teamManagement';
import { requestsApi } from '../../api/requests';
import { invitesApi } from '../../api/invites';
import { registrationApi } from '../../api/registration';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import { Button } from '../../components/ui/Button';
import { TeamTimeline } from '../../components/dashboard/TeamTimeline';
import { TeamProgress } from '../../components/dashboard/TeamProgress';
import { RegistrationForm } from '../../components/dashboard/RegistrationForm';
import { PdfUploader } from '../../components/dashboard/PdfUploader';
import { FinalSubmissionTab } from '../../components/dashboard/FinalSubmissionTab';
import { usePermissions } from '../../hooks/usePermissions';
import { useRegistrationProgress } from '../../hooks/useRegistrationProgress';
import toast from 'react-hot-toast';

export const TeamDashboard = () => {
  const [team, setTeam] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [activeReview, setActiveReview] = useState(null);
  const [liveRegistration, setLiveRegistration] = useState(null);
  const [currentVersion, setCurrentVersion] = useState(1);
  
  const [pendingRequests, setPendingRequests] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [inviteTarget, setInviteTarget] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const { isLeader, isLocked } = usePermissions(team);
  const progress = useRegistrationProgress(liveRegistration || registration, team);

  const fetchTeamAndRequests = async () => {
    try {
      const res = await teamApi.getMyTeam();
      if (res.success) {
        setTeam(res.data);
        
        try {
          const regRes = await registrationApi.getRegistrationMe();
          if (regRes.data?.registration) {
            setRegistration(regRes.data.registration);
            setActiveReview(regRes.data.activeReview || null);
            setLiveRegistration(regRes.data.registration);
            setCurrentVersion(regRes.data.registration.version);
          }
        } catch (regErr) {
          console.error("Registration fetch failed", regErr);
        }

        if (res.data.leader?._id === user?._id) {
          const [reqRes, invRes] = await Promise.all([
            requestsApi.getTeamRequests(),
            invitesApi.getTeamInvites()
          ]);
          if (reqRes.success) setPendingRequests(reqRes.data);
          if (invRes.success) setPendingInvites(invRes.data);
        }
      }
    } catch (err) {
      if (err.response?.data?.code === 'TM_008') {
        navigate(ROUTES.PRIVATE.MEMBER_DASHBOARD || '/dashboard/member');
      } else {
        toast.error('Failed to load team data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamAndRequests();
  }, [navigate]);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const handleRemoveMember = async (targetId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    try {
      await teamManagementApi.removeMember(team._id, targetId);
      toast.success("Member removed.");
      fetchTeamAndRequests();
    } catch (err) { toast.error(err.response?.data?.message || 'Action failed.'); }
  };

  const handleLeaveTeam = async () => {
    if (!window.confirm("Are you sure you want to leave this team?")) return;
    try {
      await teamManagementApi.leaveTeam(team._id);
      toast.success("You have left the team.");
      navigate('/dashboard/member');
    } catch (err) { toast.error(err.response?.data?.message || 'Action failed.'); }
  };

  const handleTransferLeadership = async (targetId) => {
    if (!window.confirm("Are you sure you want to transfer leadership to this member? You will become a regular member.")) return;
    try {
      await teamManagementApi.transferLeadership(team._id, targetId);
      toast.success("Leadership transferred.");
      fetchTeamAndRequests();
    } catch (err) { toast.error(err.response?.data?.message || 'Action failed.'); }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading Team Data...</div>;
  }

  if (!team) return null;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Left / Main Column */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* User Profile Welcome Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-2xl p-6 text-white shadow-md flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-1">Welcome, {user?.fullName}</h2>
            <p className="text-emerald-50 opacity-90 text-sm">
              Logged in as: <span className="font-semibold">{user?.email}</span> 
              <span className="mx-2">•</span> 
              Role: <span className="capitalize">{user?.role}</span>
            </p>
          </div>
          <div className="hidden md:block">
            <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl font-bold">{user?.fullName?.charAt(0)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Overview</h1>
            <p className="text-gray-500">Manage your NEXUS 2026 participation</p>
          </div>
          <div className="px-4 py-2 bg-primary/10 text-primary font-bold rounded-lg border border-primary/20">
            {team.status}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Details</h3>
            <div className="space-y-4">
              <div><span className="block text-sm text-gray-500">Team Name</span><span className="font-semibold">{team.teamName}</span></div>
              <div><span className="block text-sm text-gray-500">Type</span><span className="font-semibold">{team.teamType}</span></div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Identifiers</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div><span className="block text-sm text-gray-500">Team ID</span><span className="font-mono font-bold">{team.teamId}</span></div>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(team.teamId, 'Team ID')}>Copy</Button>
              </div>
              <div className="flex justify-between items-center">
                <div><span className="block text-sm text-gray-500">Join Code</span><span className="font-mono font-bold text-primary">{team.joinCode}</span></div>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(team.joinCode, 'Join Code')}>Copy</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Members Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-lg font-bold text-gray-900">Members ({team.members.length}/{team.teamType === 'Solo' ? 1 : 3})</h3>
            <div className="flex gap-2">
              {!isLeader && <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50" onClick={handleLeaveTeam}>Leave Team</Button>}
            </div>
          </div>
          
          <div className="space-y-3">
            {team.members.map((member, index) => {
              const memberIsLeader = member.user?._id === team.leader?._id;
              const isMe = member.user?._id === user?._id;
              return (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="block font-semibold text-gray-900">
                      {member.user?.fullName || 'Unknown'} {isMe && '(You)'}
                    </span>
                    <span className="text-xs text-gray-500 block">{member.userId}</span>
                    <span className="text-xs text-gray-500 block">{member.user?.email}</span>
                    <span className="text-xs text-gray-500 block">{member.user?.mobile}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {memberIsLeader && <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">Leader</span>}
                    
                    {/* Leader Controls over other members */}
                    {isLeader && !isMe && (
                      <>
                        <button onClick={() => handleTransferLeadership(member.user._id)} className="text-xs text-blue-600 font-semibold hover:underline">Make Leader</button>
                        <button onClick={() => handleRemoveMember(member.user._id)} className="text-xs text-red-600 font-semibold hover:underline">Remove</button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Registration Components */}
        <div className="space-y-8 mt-8">
          {!isLeader && (
            <div className="bg-blue-50 border border-blue-100 text-blue-800 p-4 rounded-xl flex items-start gap-3">
              <span className="text-xl">ℹ️</span>
              <div>
                <h4 className="font-semibold">Read-Only Mode</h4>
                <p className="text-sm mt-1">You are a team member. Only the Team Leader can modify the registration details.</p>
              </div>
            </div>
          )}

          <RegistrationForm 
            team={team} 
            registration={registration} 
            isLeader={isLeader} 
            isLocked={isLocked}
            activeReview={activeReview}
            onVersionUpdate={setCurrentVersion}
            onLiveUpdate={setLiveRegistration}
          />

          <PdfUploader 
            registration={liveRegistration || registration} 
            isLeader={isLeader} 
            isLocked={isLocked}
            onUploadSuccess={(updatedReg) => {
              setLiveRegistration((prev) => ({ ...prev, ...updatedReg }));
              setCurrentVersion(updatedReg.version);
            }}
          />

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Finalize Registration</h3>
            <FinalSubmissionTab 
              team={team} 
              registration={liveRegistration || registration} 
              isLeader={isLeader} 
              isLocked={isLocked} 
            />
          </div>
        </div>

      </div>

      {/* Right Column (Progress & Timeline) */}
      <div className="space-y-8">
        <TeamProgress team={team} />
        
        {/* Invitations Section (Module 2) */}
        {isLeader && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Invite Members</h3>
            <div className="flex flex-col gap-4 mb-4">
              <input 
                type="text" 
                value={inviteTarget}
                onChange={(e) => setInviteTarget(e.target.value)}
                placeholder="Enter User ID or Email" 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
              <Button 
                onClick={async () => {
                  if (!inviteTarget.trim()) return toast.error("Please enter an email or User ID.");
                  try {
                    await invitesApi.sendInvite({ inviteeIdentifier: inviteTarget.trim() });
                    toast.success("Invite sent successfully!");
                    setInviteTarget('');
                  } catch (err) { toast.error(err.response?.data?.message || 'Failed to send invite.'); }
                }}
              >Send Invite</Button>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2 mt-8">Pending Join Requests</h3>
            {pendingRequests.length === 0 ? (
              <p className="text-sm text-gray-500">No pending join requests.</p>
            ) : (
              <div className="space-y-3">
                {pendingRequests.map(req => (
                  <div key={req._id} className="flex flex-col gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div>
                      <span className="font-semibold block">{req.member?.fullName}</span>
                      <span className="text-xs text-gray-500">{req.member?.email}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button 
                        size="sm" 
                        onClick={async () => {
                          try {
                            await requestsApi.acceptRequest(req._id);
                            toast.success("Request accepted!");
                            fetchTeamAndRequests();
                          } catch (err) { toast.error(err.response?.data?.message || 'Action failed.'); }
                        }}
                      >Accept</Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500"
                        onClick={async () => {
                          try {
                            await requestsApi.rejectRequest(req._id);
                            toast.success("Request rejected.");
                            fetchTeamAndRequests();
                          } catch (err) { toast.error(err.response?.data?.message || 'Action failed.'); }
                        }}
                      >Reject</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2 mt-8">Sent Invitations</h3>
            {pendingInvites.length === 0 ? (
              <p className="text-sm text-gray-500">No pending sent invitations.</p>
            ) : (
              <div className="space-y-3">
                {pendingInvites.map(inv => (
                  <div key={inv._id} className="flex flex-col gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50 flex-row justify-between items-center">
                    <div>
                      <span className="font-semibold block">{inv.invitee?.fullName}</span>
                      <span className="text-xs text-gray-500">{inv.invitee?.email}</span>
                      <span className="text-xs font-semibold text-amber-600 block mt-1">Status: {inv.status}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-500"
                      onClick={async () => {
                        try {
                          await invitesApi.cancelInvite(inv._id);
                          toast.success("Invite cancelled.");
                          fetchTeamAndRequests();
                        } catch (err) { toast.error(err.response?.data?.message || 'Action failed.'); }
                      }}
                    >Cancel</Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Activity Timeline</h3>
          <TeamTimeline teamId={team._id} />
        </div>
      </div>

    </div>
  );
};
