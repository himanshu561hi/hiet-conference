import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/admin';
import { handleApiError } from '../../utils/apiErrorHandler';
import { ArrowLeft, User, Users, FileText, ChevronDown, ChevronUp, Clock, Shield } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { PdfViewer } from '../../components/admin/PdfViewer';
import { AdminAuditLog } from '../../components/admin/AdminAuditLog';
import { ReviewHistory } from '../../components/admin/ReviewHistory';
import { AdminReviewActions } from '../../components/admin/AdminReviewActions';
import { TeamTimeline } from '../../components/dashboard/TeamTimeline';

// Accordion Wrapper Component
const Accordion = ({ title, icon: Icon, defaultOpen = true, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2 text-gray-800 font-semibold">
          {Icon && <Icon size={18} className="text-primary" />}
          {title}
        </div>
        {isOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
      </button>
      {isOpen && (
        <div className="p-6 border-t border-gray-100 animate-in slide-in-from-top-2">
          {children}
        </div>
      )}
    </div>
  );
};

export const AdminRegistrationReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ registration: null, auditLogs: [] });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await adminApi.fetchRegistrationDetails(id);
      setData(res.data);
      
      const histRes = await adminApi.fetchReviewHistory(id);
      setHistory(histRes.data.history);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading details...</div>;
  }

  const { registration, auditLogs } = data;
  const team = registration?.team;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/dashboard')} className="text-gray-400 hover:text-gray-900 transition-colors">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Registration Review</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column (Main Content) */}
        <div className="flex-1 space-y-6">
          
          <Accordion title="Team Roster" icon={Users}>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Team Name</p>
                <p className="text-lg font-semibold text-gray-900">{team?.teamName}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                  <p className="text-xs font-bold text-blue-600 uppercase mb-2">Leader</p>
                  <p className="font-semibold text-gray-900">{team?.leader?.name}</p>
                  <p className="text-sm text-gray-600">{team?.leader?.email}</p>
                  <p className="text-sm text-gray-600 mt-1">{team?.leader?.profile?.institute}</p>
                </div>
                {team?.members?.map((member, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Member</p>
                    <p className="font-semibold text-gray-900">{member?.user?.name}</p>
                    <p className="text-sm text-gray-600">{member?.user?.email}</p>
                    <p className="text-sm text-gray-600 mt-1">{member?.user?.profile?.institute}</p>
                  </div>
                ))}
              </div>
            </div>
          </Accordion>

          <Accordion title="Paper Metadata" icon={FileText}>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Paper Title</p>
                  <p className="font-semibold text-gray-900">{registration?.title || 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Abstract</p>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{registration?.abstract || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Conference Track</p>
                  <p className="font-medium text-gray-900">{registration?.conferenceTrack || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Keywords</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {registration?.keywords?.length > 0 ? (
                      registration.keywords.map((kw, i) => <span key={i} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">{kw}</span>)
                    ) : <span className="text-sm text-gray-500">N/A</span>}
                  </div>
                </div>
             </div>
          </Accordion>

          <Accordion title="PDF Document" icon={FileText}>
            <PdfViewer fileUrl={registration?.fileUrl} />
          </Accordion>

          <Accordion title="Event Timeline" icon={Clock} defaultOpen={false}>
            <TeamTimeline 
              registration={registration} 
              isLocked={team?.isLocked} 
              lastSaved={registration?.updatedAt} 
            />
          </Accordion>

          <Accordion title="Review History" icon={Shield} defaultOpen={false}>
            <ReviewHistory history={history} />
          </Accordion>

          <Accordion title="Audit Log (Admin Only)" icon={Shield} defaultOpen={false}>
            <AdminAuditLog logs={auditLogs} />
          </Accordion>

        </div>

        {/* Right Column (Sticky Sidebar) */}
        <div className="w-full lg:w-80">
          <div className="sticky top-24 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Status Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Registration No.</p>
                <p className="font-mono text-primary font-bold text-lg">{registration?.registrationNumber || 'Pending'}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Current Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                  registration?.status === 'Submitted' ? 'bg-blue-100 text-blue-700' :
                  registration?.status === 'Approved' ? 'bg-green-100 text-green-700' :
                  registration?.status === 'Needs Correction' ? 'bg-yellow-100 text-yellow-700' :
                  registration?.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {registration?.status}
                </span>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Track</p>
                <p className="font-medium text-gray-900">{registration?.conferenceTrack || 'Not Selected'}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Submitted On</p>
                <p className="font-medium text-gray-900">{new Date(registration?.createdAt).toLocaleDateString()}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">PDF Status</p>
                <p className="font-medium text-gray-900">{registration?.fileUrl ? '✅ Uploaded' : '❌ Missing'}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <AdminReviewActions 
                registrationId={registration?._id}
                currentStatus={registration?.status}
                onActionComplete={fetchDetails}
              />
              <Button variant="outline" className="w-full mt-3" onClick={() => navigate('/admin/dashboard')}>
                Back to Queue
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
