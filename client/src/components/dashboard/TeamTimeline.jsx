import React, { useEffect, useState } from 'react';
import { teamManagementApi } from '../../api/teamManagement';
import { Spinner as Loader } from '../common/Loader';

const actionMap = {
  TEAM_CREATED: { color: 'bg-green-500', icon: '🚀', label: 'Team Created' },
  INVITE_SENT: { color: 'bg-blue-500', icon: '✉️', label: 'Invite Sent' },
  MEMBER_JOINED: { color: 'bg-indigo-500', icon: '🤝', label: 'Member Joined' },
  MEMBER_REMOVED: { color: 'bg-red-500', icon: '🚪', label: 'Member Left' },
  LEADERSHIP_TRANSFERRED: { color: 'bg-purple-500', icon: '👑', label: 'Leadership Transferred' },
  DRAFT_CREATED: { color: 'bg-gray-500', icon: '📝', label: 'Draft Initialized' },
  DRAFT_SAVED: { color: 'bg-teal-500', icon: '💾', label: 'Draft Saved' },
  PAPER_CREATED: { color: 'bg-pink-500', icon: '📄', label: 'Paper Title Added' },
  TITLE_UPDATED: { color: 'bg-pink-500', icon: '✏️', label: 'Title Updated' },
  ABSTRACT_UPDATED: { color: 'bg-orange-500', icon: '📑', label: 'Abstract Updated' },
  KEYWORDS_UPDATED: { color: 'bg-yellow-500', icon: '🏷️', label: 'Keywords Updated' },
  TRACK_CHANGED: { color: 'bg-cyan-500', icon: '🛤️', label: 'Track Changed' },
  PDF_UPLOADED: { color: 'bg-red-500', icon: '📄', label: 'PDF Uploaded' },
  PDF_REPLACED: { color: 'bg-red-600', icon: '🔄', label: 'PDF Replaced' },
  FINAL_SUBMITTED: { color: 'bg-emerald-600', icon: '✅', label: 'Final Submission' },
  REGISTRATION_LOCKED: { color: 'bg-gray-800', icon: '🔒', label: 'Team Locked' }
};

export const TeamTimeline = ({ teamId }) => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await teamManagementApi.getTimeline(teamId);
        if (res.success) setTimeline(res.data);
      } catch (err) {
        console.error('Failed to load timeline');
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, [teamId]);

  if (loading) return <div className="p-4"><Loader /></div>;
  if (!timeline.length) return <p className="text-gray-500 text-sm italic">No recent activity.</p>;

  return (
    <div className="relative border-l border-gray-200 ml-3 space-y-6">
      {timeline.map((event, index) => {
        const config = actionMap[event.action] || { color: 'bg-gray-400', icon: '📌', label: event.action };
        return (
          <div key={index} className="relative pl-6">
            {/* Dot */}
            <span className={`absolute -left-[13px] top-1 h-6 w-6 rounded-full border-4 border-white flex items-center justify-center text-[10px] ${config.color}`}>
              {config.icon}
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900">{config.label}</span>
              <span className="text-xs text-gray-500">{new Date(event.createdAt).toLocaleString()}</span>
              {event.user && <span className="text-sm text-gray-700 mt-1">By {event.user.fullName}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
};
