import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/admin';
import { DataTable } from '../ui/DataTable';
import { Button } from '../ui/Button';
import { Search, Eye, Filter } from 'lucide-react';

export const AdminQueue = ({ activeStatusFilter }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [bulkAction, setBulkAction] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); 
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const handleBulkApprove = async () => {
    try {
      const res = await adminApi.bulkApprove(selectedRows);
      // Refresh
      const params = { page, limit: 10, status: activeStatusFilter, search: debouncedSearch };
      const dataRes = await adminApi.fetchQueue(params);
      setData(dataRes.data.docs);
      setSelectedRows([]);
      setBulkAction(null);
    } catch (error) {
      console.error(error);
    }
  };

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [activeStatusFilter]);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        setLoading(true);
        const params = {
          page,
          limit: 10,
          status: activeStatusFilter,
          search: debouncedSearch
        };
        const res = await adminApi.fetchQueue(params);
        setData(res.data.docs);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.error('Failed to fetch queue', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQueue();
  }, [page, activeStatusFilter, debouncedSearch]);

  const columns = [
    {
      header: 'Reg No.',
      accessor: 'registrationNumber',
      render: (row) => <span className="font-mono font-medium text-primary">{row.registrationNumber || '-'}</span>
    },
    {
      header: 'Team Name',
      accessor: 'teamName',
      render: (row) => <span className="font-semibold text-gray-900">{row.teamName}</span>
    },
    {
      header: 'Track',
      accessor: 'conferenceTrack',
      render: (row) => <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs">{row.conferenceTrack}</span>
    },
    {
      header: 'Submitted',
      accessor: 'createdAt',
      render: (row) => <span className="text-gray-500 text-sm">{new Date(row.createdAt).toLocaleDateString()}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => {
        const colors = {
          'Submitted': 'bg-blue-100 text-blue-700',
          'Under Review': 'bg-purple-100 text-purple-700',
          'Needs Correction': 'bg-yellow-100 text-yellow-700',
          'Approved': 'bg-green-100 text-green-700',
          'Rejected': 'bg-red-100 text-red-700',
        };
        const color = colors[row.status] || 'bg-gray-100 text-gray-700';
        return <span className={`px-3 py-1 rounded-full text-xs font-bold ${color}`}>{row.status}</span>;
      }
    },
    {
      header: 'Action',
      accessor: 'action',
      render: (row) => (
        <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => navigate(`/admin/registration/${row._id}`)}>
          <Eye size={14} /> View
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Reg No, Team, Leader..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={16} /> Advanced Filters
          </Button>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        isLoading={loading} 
        pagination={{
          page,
          totalPages,
          onPageChange: setPage
        }}
      />
    </div>
  );
};
