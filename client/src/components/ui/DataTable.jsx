import React from 'react';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { Button } from './Button';

/**
 * Highly reusable DataTable Component
 * @param {Array} columns - Array of objects: { header, accessor, render (optional) }
 * @param {Array} data - Array of row objects
 * @param {Boolean} isLoading - Skeleton flag
 * @param {Object} pagination - { page, totalPages, onPageChange }
 * @param {String} emptyText - Message when no data
 */
export const DataTable = ({
  columns,
  data,
  isLoading,
  pagination,
  emptyText = "No records found."
}) => {

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 animate-pulse bg-gray-50 flex gap-4">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/5"></div>
              <div className="h-6 bg-gray-200 rounded w-1/5"></div>
              <div className="h-6 bg-gray-200 rounded w-1/5"></div>
              <div className="h-6 bg-gray-200 rounded w-1/5"></div>
              <div className="h-6 bg-gray-200 rounded w-1/5"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-600">
              {columns.map((col, index) => (
                <th key={index} className="px-6 py-4 whitespace-nowrap">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data && data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <Search className="w-10 h-10 text-gray-300 mb-3" />
                    <p>{emptyText}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Footer */}
      {pagination && pagination.totalPages > 1 && (
        <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Page <span className="font-semibold text-gray-900">{pagination.page}</span> of <span className="font-semibold text-gray-900">{pagination.totalPages}</span>
          </span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
