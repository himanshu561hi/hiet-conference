import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, FileText, Lock, Send } from 'lucide-react';
import { registrationApi } from '../../api/registration';
import { handleApiError } from '../../utils/apiErrorHandler';
import { showSuccess } from '../../utils/toastHelpers';
import { Button } from '../ui/Button';

export const FinalSubmissionTab = ({ team, registration, isLeader, isLocked }) => {
  const [declaration, setDeclaration] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Validation Checks
  const checks = [
    { label: 'Team Minimum (1 Leader)', passed: team?.leader != null },
    { label: 'Paper Title', passed: !!registration?.title },
    { label: 'Abstract Completed', passed: !!registration?.abstract },
    { label: 'Conference Track', passed: !!registration?.conferenceTrack },
    { label: 'PDF Uploaded', passed: !!registration?.fileUrl }
  ];

  const allPassed = checks.every(c => c.passed);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const res = team?.status === 'Needs Correction' 
        ? await registrationApi.resubmit(registration?._id)
        : await registrationApi.finalSubmit();
      showSuccess(res.message);
      setShowModal(false);
      // Reload page to re-fetch team lock state
      window.location.reload();
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLocked || registration?.status === 'Submitted') {
    return (
      <div className="p-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Registration Successfully Submitted!</h2>
        <p className="text-gray-500 max-w-md mx-auto">Your team and paper have been officially registered. Your Registration Number is:</p>
        <div className="inline-block bg-gray-100 border border-gray-200 text-gray-800 font-mono font-bold text-xl px-6 py-3 rounded-lg shadow-inner">
          {registration?.registrationNumber || 'NEXUS2026-REG-XXXX'}
        </div>
        <p className="text-sm text-gray-400 mt-4"><Lock className="inline mr-1" size={14}/> Editing is now locked.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Summary View */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Submission Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
          <div>
            <p className="text-sm text-gray-500">Team Name</p>
            <p className="font-semibold text-gray-900">{team?.teamName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Paper Title</p>
            <p className="font-semibold text-gray-900 line-clamp-1">{registration?.title || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Conference Track</p>
            <p className="font-semibold text-gray-900">{registration?.conferenceTrack || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Uploaded PDF</p>
            {registration?.fileUrl ? (
              <a href={registration.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline font-medium">
                <FileText size={16} /> View Document
              </a>
            ) : (
              <span className="text-red-500 text-sm font-medium">Missing</span>
            )}
          </div>
        </div>
      </div>

      {/* Validation Checklist */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Validation Checklist</h3>
        <ul className="space-y-3">
          {checks.map((c, i) => (
            <li key={i} className="flex items-center gap-3 bg-white border border-gray-100 p-3 rounded-lg shadow-sm">
              {c.passed ? <CheckCircle className="text-green-500" size={20} /> : <AlertCircle className="text-red-500" size={20} />}
              <span className={`font-medium ${c.passed ? 'text-gray-900' : 'text-gray-500'}`}>{c.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Declaration */}
      {allPassed && isLeader && (
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
          <label className="flex items-start gap-4 cursor-pointer">
            <input 
              type="checkbox" 
              checked={declaration}
              onChange={(e) => setDeclaration(e.target.checked)}
              className="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span className="text-sm text-blue-900">
              <strong>Declaration:</strong> I declare that all submitted information is correct, this paper is our original work, and we agree to the terms and conditions of the NEXUS 2026 conference. I understand that submitting will permanently lock our registration.
            </span>
          </label>
        </div>
      )}

      {/* Submit Action */}
      {isLeader && (
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <Button 
            onClick={() => setShowModal(true)} 
            disabled={!allPassed || !declaration || isSubmitting}
            className="flex items-center gap-2"
          >
            <Send size={18} /> {team?.status === 'Needs Correction' ? 'Resubmit Registration' : 'Final Submit'}
          </Button>
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="p-6">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {team?.status === 'Needs Correction' ? 'Confirm Resubmission' : 'Final Submission'}
              </h3>
              <p className="text-gray-600 mb-6">
                Are you absolutely sure? Once submitted:
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                  <li>Your Registration becomes <strong className="text-gray-900">Locked</strong>.</li>
                  <li>Your Team Roster becomes <strong className="text-gray-900">Locked</strong> (No removing/leaving).</li>
                  <li>The PDF paper cannot be replaced.</li>
                </ul>
              </p>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowModal(false)} disabled={isSubmitting}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700 text-white">
                  {isSubmitting ? 'Locking...' : 'Yes, Submit & Lock'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
