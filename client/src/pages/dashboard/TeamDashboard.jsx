import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { teamApi } from '../../api/team';
import { registrationApi } from '../../api/registration';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  Users, User, FileText, CheckCircle2, Clock, Lock, XCircle, Key, MessageCircle,
  Download, Building2, MapPin, Calendar, Sparkles, ShieldCheck, Mail, Phone, Eye
} from 'lucide-react';
import { TeamTimeline } from '../../components/dashboard/TeamTimeline';
import { downloadPaperPdf } from '../../utils/downloadHelper';

const STATUS_BADGES = {
  'Under Review': { bg: 'bg-amber-100 border-amber-300 text-amber-900', icon: Clock, label: 'Under Review' },
  'Submitted': { bg: 'bg-blue-100 border-blue-300 text-blue-900', icon: Clock, label: 'Submitted (Under Review)' },
  'Under Hold': { bg: 'bg-purple-100 border-purple-300 text-purple-900', icon: Lock, label: 'Under Hold by Mentor' },
  'Approved': { bg: 'bg-emerald-100 border-emerald-300 text-emerald-900', icon: CheckCircle2, label: 'Accepted for Round 2' },
  'Accepted': { bg: 'bg-emerald-100 border-emerald-300 text-emerald-900', icon: CheckCircle2, label: 'Accepted for Round 2' },
  'Rejected': { bg: 'bg-rose-100 border-rose-300 text-rose-900', icon: XCircle, label: 'Application Rejected' }
};

export const TeamDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [teamRes, regRes] = await Promise.all([
        teamApi.getMyTeam().catch(() => null),
        registrationApi.getRegistrationMe().catch(() => null)
      ]);

      if (teamRes?.success) setTeam(teamRes.data);
      if (regRes?.data?.registration) setRegistration(regRes.data.registration);
      else if (teamRes?.data?.registration) setRegistration(teamRes.data.registration);
    } catch (err) {
      console.error('[Dashboard Data Error]:', err);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-700">Loading Leader Dashboard...</p>
        </div>
      </div>
    );
  }

  const currentStatus = registration?.status || team?.status || 'Submitted';
  const badgeConfig = STATUS_BADGES[currentStatus] || STATUS_BADGES['Under Review'];
  const StatusIcon = badgeConfig.icon;

  const leaderUser = team?.leader || user;
  const leaderEmailLower = (leaderUser?.email || '').toLowerCase().trim();
  const leaderId = (leaderUser?._id || '').toString();

  const leaderFirstName = (leaderUser?.fullName || leaderUser?.name || 'user').trim().split(' ')[0].toLowerCase();
  const leaderLast4 = (leaderUser?.mobile || '').replace(/\D/g, '').slice(-4);
  const leaderPassword = leaderLast4 ? `${leaderFirstName}${leaderLast4}` : 'N/A';

  const additionalMembers = (team?.members || []).filter(m => {
    const memEmail = (m.email || m.user?.email || '').toLowerCase().trim();
    const memId = (m.user?._id || m.userId || '').toString();
    if (leaderEmailLower && memEmail === leaderEmailLower) return false;
    if (leaderId && memId === leaderId) return false;
    return true;
  });

  const totalMembersCount = 1 + additionalMembers.length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ── Join Official WhatsApp Community Section ───────────────────────────── */}
        <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 text-2xl shadow-inner">
              💬
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-extrabold bg-white/20 border border-white/30 px-2.5 py-0.5 rounded-full text-emerald-100 tracking-wider">
                  Official Author Group
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">Join NEXUS 2026 WhatsApp Community</h2>
              <p className="text-xs text-emerald-100/90 leading-relaxed max-w-xl font-medium">
                Get real-time paper evaluation status, round 2 screening alerts, presentation schedules, and direct support from event coordinators.
              </p>
            </div>
          </div>

          <a
            href="https://chat.whatsapp.com/DjtjGF2LAc892Caura0BBV?s=cl&p=a&mlu=0&ilr=4"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto shrink-0 relative z-10"
          >
            <button
              type="button"
              className="w-full sm:w-auto bg-white hover:bg-emerald-50 text-emerald-800 font-extrabold px-6 py-3.5 rounded-2xl transition-all shadow-lg hover:scale-105 flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600/20" />
              Join WhatsApp Group Now →
            </button>
          </a>
        </div>

        {/* Read-Only Banner Notice */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Read-Only Leader Dashboard</p>
              <p className="text-[11px] text-slate-600">All submitted registration & paper details are strictly read-only and locked for evaluation.</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-white text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full uppercase">
            Locked View Mode
          </span>
        </div>

        {/* ── Top Header: Welcome Banner & Status ────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="text-xs font-mono uppercase text-emerald-800 font-bold bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                Team Leader Dashboard
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                Team: {team?.teamName || registration?.teamName || 'Your Team'}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Registration ID: <strong className="font-mono text-emerald-700">{team?.teamId || registration?.registrationNumber || 'NEXUS-2026-REG'}</strong>
              </p>
            </div>

            {/* Live Status Badge */}
            <div className={`px-4 py-2.5 rounded-2xl border ${badgeConfig.bg} flex items-center gap-2 font-bold text-xs shadow-sm shrink-0`}>
              <StatusIcon className="w-4 h-4" />
              <span>{badgeConfig.label}</span>
            </div>
          </div>

          {/* Rejection Remarks Notice if Rejected */}
          {currentStatus === 'Rejected' && registration?.rejectionReason && (
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl space-y-1">
              <p className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-600" /> Faculty Rejection Feedback:
              </p>
              <p className="text-xs text-rose-900 leading-relaxed font-medium bg-white p-3 rounded-xl border border-rose-200">
                "{registration.rejectionReason}"
              </p>
            </div>
          )}

          {/* Leader Profile Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-mono uppercase block">Team Leader</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{leaderUser?.fullName || leaderUser?.name}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-mono uppercase block">Leader Email</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5 truncate">{leaderUser?.email}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-mono uppercase block">Leader Mobile</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{leaderUser?.mobile || 'N/A'}</p>
            </div>
            <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 flex flex-col justify-between">
              <span className="text-[10px] text-emerald-800 font-mono uppercase font-bold flex items-center gap-1">
                <Key className="w-3 h-3 text-emerald-600" /> Login Password
              </span>
              <p className="font-mono font-bold text-emerald-800 text-sm mt-0.5 bg-white px-2.5 py-0.5 rounded-lg border border-emerald-300 w-fit shadow-xs">
                {leaderPassword}
              </p>
            </div>
          </div>
        </div>

        {/* ── Single Consolidated Card: Team Roster & Member Academic Details ────────────────── */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" /> Team Roster & Academic Details
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Full academic & contact details for all participating team members
              </p>
            </div>
            <span className="text-xs text-slate-700 font-mono font-bold bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full">
              {totalMembersCount} Total Participant{totalMembersCount === 1 ? '' : 's'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Leader Card */}
            <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-2xl p-5 space-y-3 shadow-sm relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2.5 mb-3">
                  <span className="text-[10px] font-bold text-emerald-900 bg-emerald-200/80 px-2.5 py-0.5 rounded-md font-mono uppercase tracking-wider border border-emerald-300">
                    Leader (Primary Author)
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>

                <div className="space-y-1">
                  <p className="font-extrabold text-slate-900 text-base">{leaderUser?.fullName || leaderUser?.name}</p>
                  <p className="text-xs text-slate-600 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {leaderUser?.email}</p>
                  <p className="text-xs text-slate-600 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {leaderUser?.mobile || 'N/A'}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-emerald-200/80 space-y-1.5 text-xs text-slate-700 font-sans">
                <div className="flex justify-between">
                  <span className="text-slate-500">College / Org:</span>
                  <span className="font-bold text-slate-900 text-right">
                    {leaderUser?.college || leaderUser?.organizationName || registration?.collegeName || registration?.organizationName || team?.institute || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Branch:</span>
                  <span className="font-bold text-slate-900">{leaderUser?.branch || registration?.branch || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Year:</span>
                  <span className="font-bold text-slate-900">{leaderUser?.year || registration?.year || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-bold text-slate-900">
                    {[leaderUser?.district || registration?.district, leaderUser?.state || registration?.state].filter(Boolean).join(', ') || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Team Members */}
            {additionalMembers.map((m, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm hover:border-slate-300 transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-3">
                    <span className="text-[10px] font-bold text-slate-700 bg-slate-200 px-2.5 py-0.5 rounded-md font-mono uppercase tracking-wider">
                      Team Member #{idx + 1}
                    </span>
                    <User className="w-4 h-4 text-slate-400" />
                  </div>

                  <div className="space-y-1">
                    <p className="font-extrabold text-slate-900 text-base">{m.fullName || m.name || m.user?.fullName}</p>
                    <p className="text-xs text-slate-600 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {m.email || m.user?.email}</p>
                    <p className="text-xs text-slate-600 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {m.mobile || m.user?.mobile || 'N/A'}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs text-slate-700 font-sans">
                  <div className="flex justify-between">
                    <span className="text-slate-500">College / Org:</span>
                    <span className="font-bold text-slate-900 text-right">{m.college || m.organizationName || m.user?.college || m.user?.organizationName || registration?.collegeName || registration?.organizationName || team?.institute || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Branch:</span>
                    <span className="font-bold text-slate-900">{m.branch || m.user?.branch || registration?.branch || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Year:</span>
                    <span className="font-bold text-slate-900">{m.year || m.user?.year || registration?.year || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Location:</span>
                    <span className="font-bold text-slate-900">
                      {[m.district || m.user?.district || registration?.district, m.state || m.user?.state || registration?.state].filter(Boolean).join(', ') || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* ── Submitted Research Paper Details (Read-Only) ───────────────────── */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" /> Submitted Research Paper
            </h2>
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-bold">
              PDF Uploaded
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-slate-500 font-mono block mb-1">Title of the Paper</span>
              <p className="text-base font-extrabold text-slate-900 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {registration?.title || registration?.paperTitle || 'AI-driven Smart Green Technology Optimization'}
              </p>
            </div>

            <div>
              <span className="text-slate-500 font-mono block mb-1">Uniqueness / Methodology Abstract</span>
              <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200 whitespace-pre-wrap">
                {registration?.abstract || registration?.uniqueness || 'No detailed abstract provided.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-mono uppercase block">Conference Track Category</span>
                <p className="font-bold text-slate-900 text-xs mt-1">
                  {registration?.conferenceTrack || registration?.paperCategory || 'T1 – Green Technology in Artificial Intelligence'}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-mono uppercase block">Sub-Category Domain</span>
                <p className="font-bold text-slate-900 text-xs mt-1">
                  {registration?.paperSubCategory || registration?.keywords?.[0] || 'AI for Climate Change Prediction'}
                </p>
              </div>
            </div>

            {/* Paper File Preview / Download */}
            {registration?.fileUrl && (
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => downloadPaperPdf(registration.fileUrl, registration?.title || 'NEXUS_2026_Research_Paper')}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-bold transition shadow-lg shadow-emerald-600/20 text-xs cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Submitted Research Paper PDF
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Conference Event Timeline ────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Calendar className="w-5 h-5 text-emerald-600" /> Event Timeline & Key Schedule
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs text-slate-700 font-sans">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-mono uppercase">Step 1</span>
              <p className="font-bold text-slate-900 mt-1">Registration Opens</p>
              <p className="text-[11px] text-slate-500 font-mono">06-08-2026</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-mono uppercase">Step 2</span>
              <p className="font-bold text-slate-900 mt-1">Submission Deadline</p>
              <p className="text-[11px] text-slate-500 font-mono">31-AUG-2026</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-mono uppercase">Step 3</span>
              <p className="font-bold text-slate-900 mt-1">Round 2 Evaluation</p>
              <p className="text-[11px] text-slate-500 font-mono">05 SEP – 07 SEP 2026</p>
            </div>
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-mono uppercase">Final Round</span>
              <p className="font-bold text-slate-900 mt-1">Offline Presentation</p>
              <p className="text-[11px] text-emerald-700 font-mono font-bold">12 SEP 2026 @ HIET</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
