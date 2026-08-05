import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin';
import { AdminQueue } from '../../components/admin/AdminQueue';
import { Users, FileText, CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';

export const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const res = await adminApi.fetchMetrics();
        setMetrics(res.data);
      } catch (error) {
        console.error("Failed to load metrics");
      }
    };
    loadMetrics();
  }, []);

  const cards = [
    { title: 'Total Registrations', value: metrics?.totalRegistrations || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Submitted Today', value: metrics?.submittedToday || 0, icon: Clock, color: 'text-cyan-600', bg: 'bg-cyan-100' },
    { title: 'Pending Review', value: (metrics?.statusCounts['Submitted'] || 0) + (metrics?.statusCounts['Under Review'] || 0), icon: FileText, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Needs Correction', value: metrics?.statusCounts['Needs Correction'] || 0, icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { title: 'Approved', value: metrics?.statusCounts['Approved'] || 0, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Rejected', value: metrics?.statusCounts['Rejected'] || 0, icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' }
  ];

  const quickFilters = ['All', 'Submitted', 'Under Review', 'Needs Correction', 'Approved', 'Rejected'];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center justify-between">
             <h1 className="text-2xl font-bold text-gray-900">Admin Review System</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {cards.map((card, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${card.bg} ${card.color}`}>
                <card.icon size={24} />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{card.value}</p>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{card.title}</p>
            </div>
          ))}
        </div>

        {/* Quick Filters */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Registration Queue</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {quickFilters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeFilter === filter 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Data Table integration */}
          <AdminQueue activeStatusFilter={activeFilter} />
        </div>

      </div>
    </div>
  );
};
