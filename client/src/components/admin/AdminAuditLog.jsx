import React from 'react';
import { DataTable } from '../ui/DataTable';

export const AdminAuditLog = ({ logs }) => {
  const columns = [
    {
      header: 'Timestamp',
      accessor: 'createdAt',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{new Date(row.createdAt).toLocaleDateString()}</span>
          <span className="text-xs text-gray-500">{new Date(row.createdAt).toLocaleTimeString()}</span>
        </div>
      )
    },
    {
      header: 'Action',
      accessor: 'action',
      render: (row) => (
        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold uppercase tracking-wider">
          {row.action.replace(/_/g, ' ')}
        </span>
      )
    },
    {
      header: 'User',
      accessor: 'user',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{row.user?.name || 'System'}</span>
          <span className="text-xs text-gray-500">{row.user?.email || 'Auto-generated'}</span>
        </div>
      )
    }
  ];

  return (
    <div className="mt-4">
      <DataTable 
        columns={columns} 
        data={logs || []} 
        isLoading={!logs}
        emptyText="No audit logs recorded for this registration yet."
      />
    </div>
  );
};
