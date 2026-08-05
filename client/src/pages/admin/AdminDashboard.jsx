import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../api/admin';
import toast from 'react-hot-toast';
import {
  Users, FileText, CheckCircle, AlertTriangle, XCircle, Clock,
  Download, Search, Lock, RefreshCw, Bell, LogOut, LayoutDashboard,
  Eye, Filter, ChevronRight, X, Shield, FileSpreadsheet, Sparkles
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const STATUS_CONFIG = {
  'Under Review': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock },
  'Submitted': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: FileText },
  'Under Hold': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: Lock },
  'Approved': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle },
  'Accepted': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle },
  'Rejected': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: XCircle }
};

const PIE_COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444'];

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'all', 'under_review', 'under_hold', 'accepted', 'rejected'
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [trackFilter, setTrackFilter] = useState('All');
  const [autoPoll, setAutoPoll] = useState(true);

  // Modal States
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [rejectionModalReg, setRejectionModalReg] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionError, setRejectionError] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // ── Fetch Data ──────────────────────────────────────────────────────────

  const fetchData = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const [metricsRes, queueRes] = await Promise.all([
        adminApi.fetchMetrics(),
        adminApi.fetchQueue({ limit: 100, status: 'All' })
      ]);

      setMetrics(metricsRes.data);
      const docs = queueRes.data.docs || queueRes.data || [];
      setRegistrations(docs);

      if (isManual) toast.success('Dashboard refreshed with latest live data!');
    } catch (err) {
      console.error('[Fetch Admin Error]:', err);
      if (isManual) toast.error('Failed to refresh live data.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Real-time polling every 15 seconds
  useEffect(() => {
    if (!autoPoll) return;
    const interval = setInterval(() => {
      fetchData(false);
    }, 15000);
    return () => clearInterval(interval);
  }, [autoPoll]);

  // ── Metrics Calculations ────────────────────────────────────────────────

  const counts = useMemo(() => {
    const total = registrations.length;
    const underReview = registrations.filter(r => r.status === 'Under Review' || r.status === 'Submitted').length;
    const underHold = registrations.filter(r => r.status === 'Under Hold').length;
    const accepted = registrations.filter(r => r.status === 'Accepted' || r.status === 'Approved').length;
    const rejected = registrations.filter(r => r.status === 'Rejected').length;

    return { total, underReview, underHold, accepted, rejected };
  }, [registrations]);

  // Chart Data
  const pieData = useMemo(() => [
    { name: 'Under Review', value: counts.underReview },
    { name: 'Submitted', value: Math.max(0, counts.underReview - 1) },
    { name: 'Under Hold', value: counts.underHold },
    { name: 'Accepted', value: counts.accepted },
    { name: 'Rejected', value: counts.rejected }
  ], [counts]);

  const trackData = useMemo(() => {
    const map = {};
    registrations.forEach(r => {
      const tr = r.conferenceTrack || 'General';
      map[tr] = (map[tr] || 0) + 1;
    });
    return Object.keys(map).map(k => ({ name: k.slice(0, 15), count: map[k] }));
  }, [registrations]);

  // ── Filtered Registrations List ──────────────────────────────────────────

  const filteredRegistrations = useMemo(() => {
    return registrations.filter(reg => {
      // Tab filter
      if (activeTab === 'under_review' && !(reg.status === 'Under Review' || reg.status === 'Submitted')) return false;
      if (activeTab === 'under_hold' && reg.status !== 'Under Hold') return false;
      if (activeTab === 'accepted' && !(reg.status === 'Accepted' || reg.status === 'Approved')) return false;
      if (activeTab === 'rejected' && reg.status !== 'Rejected') return false;

      // Track Filter
      if (trackFilter !== 'All' && !reg.conferenceTrack?.includes(trackFilter)) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = reg.teamName?.toLowerCase().includes(q) || reg.team?.teamName?.toLowerCase().includes(q);
        const matchesId = reg.registrationNumber?.toLowerCase().includes(q) || reg.team?.teamId?.toLowerCase().includes(q);
        const matchesEmail = reg.team?.leader?.email?.toLowerCase().includes(q);
        const matchesTitle = reg.title?.toLowerCase().includes(q);
        return matchesName || matchesId || matchesEmail || matchesTitle;
      }

      return true;
    });
  }, [registrations, activeTab, trackFilter, searchQuery]);

  // ── Status Update Handlers ───────────────────────────────────────────────

  const handleStatusChange = async (reg, newStatus) => {
    if (newStatus === 'Rejected') {
      setRejectionModalReg(reg);
      setRejectionReason('');
      setRejectionError('');
      return;
    }

    try {
      await adminApi.updateStatus(reg._id, newStatus);
      toast.success(`Status updated to ${newStatus}`);
      fetchData();
      if (selectedTeam?._id === reg._id) {
        setSelectedTeam(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update status';
      toast.error(msg);
    }
  };

  const submitRejection = async () => {
    const words = rejectionReason.trim().split(/\s+/).filter(Boolean);
    if (words.length < 10) {
      setRejectionError(`Minimum 10 words required. You entered ${words.length} word${words.length === 1 ? '' : 's'}.`);
      return;
    }

    try {
      await adminApi.updateStatus(rejectionModalReg._id, 'Rejected', rejectionReason);
      toast.success('Registration Rejected with recorded feedback.');
      setRejectionModalReg(null);
      setRejectionReason('');
      setRejectionError('');
      fetchData();
      if (selectedTeam?._id === rejectionModalReg._id) {
        setSelectedTeam(prev => ({ ...prev, status: 'Rejected', rejectionReason }));
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reject registration';
      setRejectionError(msg);
    }
  };

  // ── Excel Download ──────────────────────────────────────────────────────

  const handleExportExcel = async (sectionFilter = null) => {
    try {
      toast.loading('Generating Excel File...', { id: 'excel_export' });
      let filter = {};
      const target = sectionFilter || activeTab;

      if (target === 'under_review') filter.status = { $in: ['Submitted', 'Under Review'] };
      else if (target === 'under_hold') filter.status = 'Under Hold';
      else if (target === 'accepted') filter.status = { $in: ['Approved', 'Accepted'] };
      else if (target === 'rejected') filter.status = 'Rejected';

      const blobData = await adminApi.bulkExport(filter, 'Excel');
      const url = window.URL.createObjectURL(new Blob([blobData]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Nexus2026_Registrations_${target.toUpperCase()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Excel downloaded successfully!', { id: 'excel_export' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to download Excel sheet.', { id: 'excel_export' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* ── Top Navigation Bar ──────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-md px-4 lg:px-8 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-emerald-600/20 shadow-lg text-white">
            <Shield className="w-6 h-6 font-bold" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight flex items-center gap-2">
              NEXUS 2026 Portal
              <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-mono uppercase font-bold">
                {user?.role === 'admin' ? 'Administrator' : 'Editorial Faculty'}
              </span>
            </h1>
            <p className="text-xs text-slate-500">HIET Ghaziabad — International Conference Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Real-time Polling Toggle */}
          <button
            onClick={() => setAutoPoll(!autoPoll)}
            className={`hidden sm:flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border transition ${
              autoPoll 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold' 
                : 'bg-slate-100 border-slate-300 text-slate-600'
            }`}
            title="Auto-refresh every 15s"
          >
            <span className={`w-2 h-2 rounded-full ${autoPoll ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'}`}></span>
            {autoPoll ? 'Live Updates ON' : 'Live Paused'}
          </button>

          {/* Manual Refresh */}
          <button
            onClick={() => fetchData(true)}
            disabled={isRefreshing}
            className="p-2 bg-slate-100 border border-slate-300 hover:bg-slate-200 text-slate-700 rounded-lg transition"
            title="Refresh Data Now"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 bg-slate-100 border border-slate-300 hover:bg-slate-200 text-slate-700 rounded-lg transition relative"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 p-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                  <span className="text-xs font-bold text-slate-900">Real-Time Updates</span>
                  <span className="text-[10px] text-slate-500 font-mono">{notifications.length} events</span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.map((n, i) => (
                    <div key={i} className="text-xs p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-slate-800 font-medium">{n.text}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Export Excel Button */}
          <button
            onClick={() => handleExportExcel('all')}
            className="hidden md:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-md shadow-emerald-600/20"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Download Excel
          </button>

          {/* User Profile / Logout */}
          <div className="pl-2 border-l border-slate-200 flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900">{user?.fullName}</p>
              <p className="text-[10px] text-slate-500 font-mono">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 rounded-lg transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Container: Sidebar + Content Area ────────────────────────── */}
      <div className="flex-1 flex flex-col md:flex-row">

        {/* ── Sidebar Navigation ──────────────────────────────────────────── */}
        <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-4 flex flex-col gap-2 shrink-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1">Navigation Menu</p>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
              activeTab === 'dashboard'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4 text-emerald-600" />
              <span>Dashboard Overview</span>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          </button>

          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mt-4 mb-1">Registration Sections</p>

          {[
            { id: 'all', label: 'Total Registration', count: counts.total, icon: Users, color: 'text-blue-600' },
            { id: 'under_review', label: 'Under Review (New)', count: counts.underReview, icon: Clock, color: 'text-amber-600' },
            { id: 'under_hold', label: 'Under Hold (Mentors)', count: counts.underHold, icon: Lock, color: 'text-purple-600' },
            { id: 'accepted', label: 'Accepted Papers', count: counts.accepted, icon: CheckCircle, color: 'text-emerald-600' },
            { id: 'rejected', label: 'Rejected Papers', count: counts.rejected, icon: XCircle, color: 'text-rose-600' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                activeTab === tab.id
                  ? 'bg-slate-100 text-slate-900 font-bold border border-slate-300 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <tab.icon className={`w-4 h-4 ${tab.color}`} />
                <span>{tab.label}</span>
              </div>
              <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full text-[10px] font-mono text-slate-700 font-bold">
                {tab.count}
              </span>
            </button>
          ))}

          <div className="mt-auto pt-6">
            <button
              onClick={() => handleExportExcel(activeTab)}
              className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Download Section Excel
            </button>
          </div>
        </aside>

        {/* ── Main Content Body ────────────────────────────────────────────── */}
        <main className="flex-1 p-4 lg:p-8 space-y-6 overflow-x-hidden">

          {/* ── Stat Cards Bar ──────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: 'Total Registration', value: counts.total, icon: Users, bg: 'bg-blue-50/80 border-blue-200', text: 'text-blue-700' },
              { label: 'Under Review', value: counts.underReview, icon: Clock, bg: 'bg-amber-50/80 border-amber-200', text: 'text-amber-700' },
              { label: 'Under Hold', value: counts.underHold, icon: Lock, bg: 'bg-purple-50/80 border-purple-200', text: 'text-purple-700' },
              { label: 'Accepted', value: counts.accepted, icon: CheckCircle, bg: 'bg-emerald-50/80 border-emerald-200', text: 'text-emerald-700' },
              { label: 'Rejected', value: counts.rejected, icon: XCircle, bg: 'bg-rose-50/80 border-rose-200', text: 'text-rose-700' }
            ].map((card, i) => (
              <div
                key={i}
                className={`${card.bg} border rounded-2xl p-4 flex flex-col justify-between shadow-sm`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700">{card.label}</span>
                  <card.icon className={`w-5 h-5 ${card.text}`} />
                </div>
                <p className="text-3xl font-extrabold text-slate-900 mt-3 font-mono">{card.value}</p>
              </div>
            ))}
          </div>

          {/* ── Dashboard Graphs & Visuals (Shown on Overview tab) ─────────── */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart: Status Distribution */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
                  <span>Registration Status Distribution</span>
                  <span className="text-xs font-normal text-slate-500">Real-time Analytics</span>
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 text-xs mt-2">
                  {pieData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[idx] }}></span>
                      <span className="text-slate-700 font-medium">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bar Chart: Submissions by Track */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Track-Wise Registration Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trackData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
                      <YAxis stroke="#64748b" allowDecimals={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a' }} />
                      <Bar dataKey="count" fill="#059669" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* ── Table Controls: Search & Smart Track Filter ──────────────── */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search Box */}
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search Team, Registration ID, Leader Email, Paper..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Track Selector & Excel Export */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <select
                    value={trackFilter}
                    onChange={e => setTrackFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-300 text-xs text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="All">All Conference Tracks</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Robotics & Automation">Robotics & Automation</option>
                    <option value="Cybersecurity & Cloud">Cybersecurity & Cloud</option>
                    <option value="VLSI & Embedded Systems">VLSI & Embedded Systems</option>
                    <option value="Sustainable Energy">Sustainable Energy</option>
                  </select>
                </div>

                <button
                  onClick={() => handleExportExcel(activeTab)}
                  className="bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  Export {activeTab.toUpperCase()}
                </button>
              </div>
            </div>

            {/* ── Registrations Data Table ─────────────────────────────────── */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase font-mono border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Reg No. / Team</th>
                    <th className="py-3 px-4">Institute & Track</th>
                    <th className="py-3 px-4">Leader & Members</th>
                    <th className="py-3 px-4">Paper Title</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                        Loading Registrations...
                      </td>
                    </tr>
                  ) : filteredRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        No registrations found for current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map(reg => {
                      const isLockedHold = reg.status === 'Under Hold' && reg.heldBy && reg.heldBy !== user?._id && user?.role !== 'admin';
                      return (
                        <tr key={reg._id} className="hover:bg-slate-50/80 transition">
                          {/* Reg No & Team */}
                          <td className="py-3 px-4">
                            <span className="font-mono text-emerald-700 font-bold block">{reg.registrationNumber || reg.team?.teamId || 'N/A'}</span>
                            <span className="font-bold text-slate-900 text-sm">{reg.teamName || reg.team?.teamName}</span>
                          </td>

                          {/* Institute & Track */}
                          <td className="py-3 px-4">
                            <p className="text-slate-800 font-medium">{reg.institute || reg.team?.institute || 'HIET Ghaziabad'}</p>
                            <span className="text-[10px] text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded mt-1 inline-block">
                              {reg.conferenceTrack || 'General'}
                            </span>
                          </td>

                          {/* Leader & Members */}
                          <td className="py-3 px-4">
                            <p className="font-bold text-slate-900">{reg.team?.leader?.fullName || 'N/A'}</p>
                            <p className="text-[10px] text-slate-500">{reg.team?.leader?.email}</p>
                            <span className="text-[10px] text-emerald-700 font-mono font-semibold mt-1 block">
                              +{reg.team?.members?.length || 0} members
                            </span>
                          </td>

                          {/* Paper Title */}
                          <td className="py-3 px-4 max-w-xs">
                            <p className="font-medium text-slate-900 truncate">{reg.title || 'Untitled Paper'}</p>
                            {reg.fileUrl && (
                              <a
                                href={reg.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-blue-600 hover:underline flex items-center gap-1 mt-1 font-semibold"
                              >
                                <FileText className="w-3 h-3" /> Download Paper PDF
                              </a>
                            )}
                          </td>

                          {/* Status Badge */}
                          <td className="py-3 px-4">
                            <div className="flex flex-col gap-1">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                reg.status === 'Approved' || reg.status === 'Accepted'
                                  ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                                  : reg.status === 'Under Hold'
                                  ? 'bg-purple-100 border-purple-300 text-purple-800'
                                  : reg.status === 'Rejected'
                                  ? 'bg-rose-100 border-rose-300 text-rose-800'
                                  : 'bg-amber-100 border-amber-300 text-amber-800'
                              }`}>
                                {reg.status === 'Under Hold' && <Lock className="w-3 h-3" />}
                                {reg.status}
                              </span>

                              {reg.status === 'Under Hold' && reg.heldByName && (
                                <span className="text-[9px] text-purple-700 font-mono">
                                  Held by: {reg.heldByName}
                                </span>
                              )}

                              {reg.status === 'Rejected' && reg.rejectionReason && (
                                <span className="text-[9px] text-rose-700 italic truncate max-w-[150px]" title={reg.rejectionReason}>
                                  Reason: {reg.rejectionReason}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {/* View Details Modal Button */}
                              <button
                                onClick={() => setSelectedTeam(reg)}
                                className="p-1.5 bg-slate-100 border border-slate-300 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                                title="View Team & Paper Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Status Select Dropdown */}
                              {isLockedHold ? (
                                <span className="text-[10px] bg-slate-100 border border-purple-300 text-purple-800 px-2 py-1 rounded flex items-center gap-1 font-bold" title="Locked by mentor">
                                  <Lock className="w-3 h-3 text-purple-600" /> Locked
                                </span>
                              ) : (
                                <select
                                  value={reg.status === 'Approved' ? 'Accepted' : reg.status}
                                  onChange={e => handleStatusChange(reg, e.target.value)}
                                  className="bg-slate-50 border border-slate-300 text-[11px] text-slate-800 rounded-lg px-2 py-1 focus:outline-none focus:border-emerald-600 font-medium"
                                >
                                  <option value="Submitted">Under Review</option>
                                  <option value="Under Hold">Under Hold</option>
                                  <option value="Accepted">Accepted</option>
                                  <option value="Rejected">Rejected</option>
                                </select>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

      {/* ── Team & Paper Details Modal ─────────────────────────────────────── */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-mono text-emerald-700 font-bold">{selectedTeam.registrationNumber || selectedTeam.team?.teamId}</span>
                <h2 className="text-xl font-bold text-slate-900">{selectedTeam.teamName || selectedTeam.team?.teamName}</h2>
                <p className="text-xs text-slate-500">{selectedTeam.institute || selectedTeam.team?.institute} — {selectedTeam.conferenceTrack}</p>
              </div>
              <button onClick={() => setSelectedTeam(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Change inside Modal */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-500">Current Status</p>
                <span className="font-bold text-emerald-700 text-sm">{selectedTeam.status}</span>
                {selectedTeam.heldByName && <p className="text-xs text-purple-700 font-mono mt-0.5">Mentor Hold: {selectedTeam.heldByName}</p>}
              </div>

              <div className="flex gap-2">
                {['Under Review', 'Under Hold', 'Accepted', 'Rejected'].map(st => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedTeam, st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      selectedTeam.status === st || (st === 'Accepted' && selectedTeam.status === 'Approved')
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Rejection Reason Display if Rejected */}
            {selectedTeam.rejectionReason && (
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl">
                <p className="text-xs font-bold text-rose-800 mb-1">Rejection Remarks Recorded:</p>
                <p className="text-xs text-rose-900">{selectedTeam.rejectionReason}</p>
              </div>
            )}

            {/* Team Leader & Members Grid */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Team Members & Leader</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Leader Card */}
                <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded uppercase border border-emerald-300">Team Leader</span>
                  <p className="font-bold text-slate-900 text-sm mt-1">{selectedTeam.team?.leader?.fullName || 'N/A'}</p>
                  <p className="text-xs text-slate-700">{selectedTeam.team?.leader?.email}</p>
                  <p className="text-xs text-slate-500">{selectedTeam.team?.leader?.mobile} | {selectedTeam.team?.leader?.branch || 'CSE'} ({selectedTeam.team?.leader?.year || '4th Year'})</p>
                </div>

                {/* Members */}
                {selectedTeam.team?.members?.map((m, idx) => (
                  <div key={idx} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-600 uppercase">Member #{idx + 1}</span>
                    <p className="font-bold text-slate-900 text-sm mt-1">{m.fullName || m.name || m.user?.fullName}</p>
                    <p className="text-xs text-slate-700">{m.email || m.user?.email}</p>
                    <p className="text-xs text-slate-500">{m.mobile || m.user?.mobile} | {m.branch || 'CSE'} ({m.year || '3rd Year'})</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Paper Details */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Paper Details</h3>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <p className="text-xs text-slate-500 font-mono">Title</p>
                <p className="text-sm font-semibold text-slate-900">{selectedTeam.title || 'Untitled Paper'}</p>
                <p className="text-xs text-slate-500 font-mono mt-2">Abstract / Uniqueness</p>
                <p className="text-xs text-slate-800 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">{selectedTeam.abstract || 'No abstract provided.'}</p>
                {selectedTeam.fileUrl && (
                  <div className="pt-2">
                    <a
                      href={selectedTeam.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-md"
                    >
                      <Download className="w-4 h-4" /> Download Submitted Paper PDF
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Rejection Reason Modal (Enforces min 10 words) ──────────────────── */}
      {rejectionModalReg && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-rose-700 flex items-center gap-2">
                <XCircle className="w-5 h-5" /> Rejection Remarks Required
              </h3>
              <button onClick={() => setRejectionModalReg(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Please enter detailed feedback for rejecting team <strong>"{rejectionModalReg.teamName}"</strong>.
              <span className="text-amber-700 font-semibold block mt-1">Rule: Description must be at least 10 words.</span>
            </p>

            <div>
              <textarea
                value={rejectionReason}
                onChange={e => {
                  setRejectionReason(e.target.value);
                  setRejectionError('');
                }}
                rows={4}
                placeholder="Explain clearly why this submission was rejected (minimum 10 words)..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-600 focus:bg-white transition"
              />
              <div className="flex justify-between text-[11px] mt-1 text-slate-500">
                <span>
                  Words: <strong className={rejectionReason.trim().split(/\s+/).filter(Boolean).length >= 10 ? 'text-emerald-700' : 'text-amber-700'}>
                    {rejectionReason.trim().split(/\s+/).filter(Boolean).length}
                  </strong> / 10 minimum
                </span>
              </div>
              {rejectionError && <p className="text-xs text-rose-600 mt-1">{rejectionError}</p>}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectionModalReg(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={submitRejection}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
