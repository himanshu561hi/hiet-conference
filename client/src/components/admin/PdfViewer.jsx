import React from 'react';
import { Download, ExternalLink, FileText } from 'lucide-react';
import { Button } from '../ui/Button';

export const PdfViewer = ({ fileUrl }) => {
  if (!fileUrl) {
    return (
      <div className="w-full h-96 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-500">
        <FileText size={48} className="text-gray-300 mb-4" />
        <p>No PDF uploaded for this registration.</p>
      </div>
    );
  }

  return (
    <div className="w-full border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-2 text-gray-700 font-medium text-sm">
          <FileText size={16} /> Paper Preview
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.open(fileUrl, '_blank')}
            className="flex items-center gap-1"
          >
            <ExternalLink size={14} /> New Tab
          </Button>
          <a 
            href={fileUrl} 
            download 
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download size={14} /> Download
          </a>
        </div>
      </div>
      
      {/* The actual PDF Embed */}
      <div className="w-full h-[600px] bg-gray-100">
        <object 
          data={fileUrl} 
          type="application/pdf" 
          width="100%" 
          height="100%"
          className="w-full h-full"
        >
          <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
            <p>Your browser does not support inline PDFs.</p>
            <Button onClick={() => window.open(fileUrl, '_blank')}>Open PDF Externally</Button>
          </div>
        </object>
      </div>
    </div>
  );
};
