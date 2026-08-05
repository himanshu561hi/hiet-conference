import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin';
import { PageLoader } from '../../components/ui/Loaders';
import { handleApiError } from '../../utils/apiErrorHandler';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, FileText, CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';

const COLORS = ['#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'];
const STATUS_COLORS = {
  Approved: '#22c55e',
  Rejected: '#ef4444',
  'Needs Correction': '#eab308',
  'Under Review': '#3b82f6',
  'Submitted': '#6366f1'
};

export const AdminAnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await adminApi.fetchDashboardSummary();
        setData(res.data);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading || !data) return <PageLoader text="Loading Analytics..." />;

  const { metrics, charts, recentActivity } = data;

  const metricCards = [
    { title: 'Total Registrations', value: metrics.totalRegistrations, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Submitted Today', value: metrics.submittedToday, icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Pending Review', value: metrics.pendingReview, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Approved', value: metrics.approved, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Needs Correction', value: metrics.needsCorrection, icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { title: 'Rejected', value: metrics.rejected, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
        <p className="text-gray-500">Real-time overview of the NEXUS 2026 registration status.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metricCards.map((card, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className={`p-3 rounded-lg ${card.bg} mb-3`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">{card.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Layer 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Registrations Per Day</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.registrationsPerDay}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" tick={{fontSize: 12}} stroke="#9CA3AF" />
                <YAxis tick={{fontSize: 12}} stroke="#9CA3AF" allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Submissions by Conference Track</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.byTrack} layout="vertical" margin={{ left: 50 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" tick={{fontSize: 12}} stroke="#9CA3AF" allowDecimals={false} />
                <YAxis dataKey="name" type="category" tick={{fontSize: 12}} stroke="#9CA3AF" width={100} />
                <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]}>
                  {charts.byTrack.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Layer 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Team Type</h3>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={charts.byTeamType} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" nameKey="name" label>
                  {charts.byTeamType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Activity Log</h3>
          <div className="space-y-4">
            {recentActivity.map((log, i) => (
              <div key={i} className="flex gap-4 items-start p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs">
                  {log.user?.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <p className="text-sm text-gray-900 font-medium">
                    {log.user?.name || 'Admin'} <span className="font-normal text-gray-500">performed</span> {log.action.replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(log.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && <p className="text-gray-500 text-sm">No recent activity.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
