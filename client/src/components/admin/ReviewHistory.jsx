import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const ReviewHistory = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <Clock className="w-8 h-8 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No review history available.</p>
      </div>
    );
  }

  const getStatusConfig = (action) => {
    switch (action) {
      case 'Approved': return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' };
      case 'Rejected': return { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' };
      case 'Needs Correction': return { icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-50' };
      case 'Resubmitted': return { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' };
      default: return { icon: Clock, color: 'text-gray-500', bg: 'bg-gray-50' };
    }
  };

  return (
    <div className="space-y-6">
      {history.map((round, idx) => {
        const config = getStatusConfig(round.action);
        const Icon = config.icon;
        
        return (
          <div key={idx} className={`relative p-5 rounded-xl border border-gray-100 shadow-sm bg-white`}>
            {/* Round Badge */}
            <div className="absolute -top-3 -right-2">
              <Badge variant={round.status === 'Active' ? 'primary' : 'outline'}>
                Round {round.reviewRound} {round.status === 'Active' && '(Active)'}
              </Badge>
            </div>

            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg ${config.bg}`}>
                <Icon className={`w-6 h-6 ${config.color}`} />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-gray-900">{round.action}</h4>
                  <span className="text-xs text-gray-500">{new Date(round.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-500 mb-3">Reviewed by: {round.reviewerId?.name || 'Admin'}</p>

                {/* Public Notes / Rejection Reason */}
                {round.publicNotes && (
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-3">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Public Notes</p>
                    <p className="text-sm text-gray-800">{round.publicNotes}</p>
                  </div>
                )}

                {/* Internal Notes (Admin Only viewing this component anyway) */}
                {round.internalNotes && (
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 mb-3">
                    <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider mb-1">Internal Admin Notes</p>
                    <p className="text-sm text-purple-900">{round.internalNotes}</p>
                  </div>
                )}

                {/* Correction Items */}
                {round.correctionItems && round.correctionItems.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wider mb-2">Requested Corrections</p>
                    <ul className="space-y-2">
                      {round.correctionItems.map((item, i) => (
                        <li key={i} className="flex flex-col bg-yellow-50/50 p-3 rounded border border-yellow-100">
                          <span className="text-xs font-bold text-yellow-800">{item.category}</span>
                          <span className="text-sm text-gray-700 mt-1">{item.comment}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
