import React, { useState } from 'react';
import { adminApi } from '../../api/admin';
import { Button } from '../../components/ui/Button';
import { handleApiError } from '../../utils/apiErrorHandler';
import { Download, FileText, FileSpreadsheet, File } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminReports = () => {
  const [downloading, setDownloading] = useState(null);

  const handleExport = async (format) => {
    try {
      setDownloading(format);
      
      const blob = await adminApi.bulkExport({}, format);
      
      // Handle file download
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      
      const ext = format === 'CSV' ? 'csv' : format === 'Excel' ? 'xlsx' : 'pdf';
      link.setAttribute('download', `Registrations_Export.${ext}`);
      
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      toast.success(`Exported to ${format} successfully!`);
    } catch (error) {
      handleApiError(error);
    } finally {
      setDownloading(null);
    }
  };

  const reports = [
    {
      title: 'Full Database Export (CSV)',
      description: 'Download the complete registration dataset as a comma-separated values file suitable for importing into legacy systems or simple data analysis.',
      format: 'CSV',
      icon: FileText,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'Detailed Excel Report',
      description: 'A formatted spreadsheet containing all registrations, team details, and tracks with styled headers.',
      format: 'Excel',
      icon: FileSpreadsheet,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100'
    },
    {
      title: 'Printable PDF Summary',
      description: 'A clean, printable PDF document summarizing all registrations for physical filing or executive meetings.',
      format: 'PDF',
      icon: File,
      color: 'text-red-600',
      bg: 'bg-red-100'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex items-center gap-3 border-b pb-6">
        <div className="p-3 bg-gray-900 text-white rounded-xl">
          <Download size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Exports</h1>
          <p className="text-gray-500">Generate and download comprehensive data reports from the platform.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div key={report.format} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-xl ${report.bg} ${report.color} flex items-center justify-center mb-6`}>
              <report.icon size={28} />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">{report.title}</h3>
            <p className="text-gray-500 text-sm flex-1 mb-6">
              {report.description}
            </p>
            
            <Button 
              onClick={() => handleExport(report.format)}
              isLoading={downloading === report.format}
              disabled={downloading !== null}
              className="w-full flex justify-center items-center gap-2"
              variant={report.format === 'PDF' ? 'danger' : 'primary'}
            >
              {downloading === report.format ? `Generating ${report.format}...` : `Download ${report.format}`}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
