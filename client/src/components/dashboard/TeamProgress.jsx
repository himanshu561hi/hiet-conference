import React from 'react';

const statuses = [
  'Draft', 
  'Registration Started', 
  'Registration Completed', 
  'Paper Uploaded', 
  'Submitted',
  'Under Review',
  'Approved'
];

export const TeamProgress = ({ team }) => {
  // Determine progress logic
  let currentIndex = statuses.indexOf(team.status);
  if (currentIndex === -1) currentIndex = 0;
  if (team.status === 'Locked' || team.status === 'Rejected') currentIndex = statuses.length - 1; // Simplification

  const progressPercentage = Math.round(((currentIndex + 1) / statuses.length) * 100);
  
  const isComplete = (step) => {
    return currentIndex >= statuses.indexOf(step);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Team Progress</h3>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div 
          className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <p className="text-xs text-right text-gray-500 font-bold mb-6">{progressPercentage}% Complete</p>

      {/* Checkpoints */}
      <ul className="space-y-3 text-sm">
        <li className={`flex items-center ${isComplete('Draft') ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
          <span className="mr-2">{isComplete('Draft') ? '✓' : '○'}</span> Team Created
        </li>
        <li className={`flex items-center ${team.members.length > 1 || team.teamType === 'Solo' ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
          <span className="mr-2">{team.members.length > 1 || team.teamType === 'Solo' ? '✓' : '○'}</span> Members Complete
        </li>
        <li className={`flex items-center ${isComplete('Registration Completed') ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
          <span className="mr-2">{isComplete('Registration Completed') ? '✓' : '○'}</span> Registration Finalized
        </li>
        <li className={`flex items-center ${isComplete('Paper Uploaded') ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
          <span className="mr-2">{isComplete('Paper Uploaded') ? '✓' : '○'}</span> Paper Uploaded
        </li>
        <li className={`flex items-center ${isComplete('Submitted') ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
          <span className="mr-2">{isComplete('Submitted') ? '✓' : '○'}</span> Final Submission
        </li>
      </ul>
    </div>
  );
};
