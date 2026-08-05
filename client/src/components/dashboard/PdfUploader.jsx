import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Clock, Trash2, Download } from 'lucide-react';
import { registrationApi } from '../../api/registration';
import { handleApiError } from '../../utils/apiErrorHandler';
import { showSuccess } from '../../utils/toastHelpers';
import { Button } from '../ui/Button';

export const PdfUploader = ({ registration, isLeader, isLocked, onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isLeader || isLocked) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      handleApiError({ message: 'Only PDF files are allowed.' });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      handleApiError({ message: 'File size must be less than 10MB.' });
      return;
    }

    const formData = new FormData();
    formData.append('paper', file);

    try {
      setIsUploading(true);
      setProgress(0);
      const res = await registrationApi.uploadPdf(formData, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgress(percentCompleted);
      });
      showSuccess(res.message || 'PDF Uploaded Successfully');
      onUploadSuccess(res.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsUploading(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isLeader || isLocked) return;
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const { fileUrl, previousVersions } = registration || {};

  return (
    <div className="space-y-6">
      
      {/* Upload Zone */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="text-primary" /> Paper Upload
            </h2>
            <p className="text-sm text-gray-500 mt-1">Upload your research paper in PDF format (Max 10MB).</p>
          </div>
          {fileUrl && <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded flex items-center gap-1"><CheckCircle size={14}/> SUBMITTED</span>}
        </div>
        
        <div className="p-6">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="application/pdf" 
            className="hidden" 
            disabled={!isLeader || isLocked || isUploading}
          />
          
          <div 
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all ${
              isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400 bg-gray-50'
            } ${( !isLeader || isLocked ) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => (!isLeader || isLocked || isUploading) ? null : fileInputRef.current?.click()}
          >
            {isUploading ? (
              <div className="text-center w-full max-w-xs">
                <Loader className="animate-spin text-primary mx-auto mb-4" size={40} />
                <p className="font-semibold text-gray-900">Uploading Document...</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{progress}% completed</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                  <UploadCloud size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {fileUrl ? 'Upload a newer version' : 'Click or Drag PDF here'}
                </h3>
                <p className="text-sm text-gray-500">Supported format: .pdf only</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Current File & Version History */}
      {fileUrl && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">File Version History</h3>
          
          <div className="space-y-4">
            {/* Current Active Version */}
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-green-900">Current Version (v{registration.version})</h4>
                  <p className="text-xs text-green-700">Active Submission</p>
                </div>
              </div>
              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800 bg-green-100 px-3 py-1.5 rounded-lg transition-colors">
                <Download size={16} /> View PDF
              </a>
            </div>

            {/* Previous Versions */}
            {previousVersions && previousVersions.length > 0 && previousVersions.slice().reverse().map((v, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    <Clock size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Version {v.version}</h4>
                    <p className="text-xs text-gray-500">{new Date(v.savedAt).toLocaleString()}</p>
                  </div>
                </div>
                {v.fileUrl ? (
                   <a href={v.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
                     <Download size={14} /> View
                   </a>
                ) : (
                  <span className="text-xs text-gray-400 italic">No file attached</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Loader = ({ className, size }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
  </svg>
);
