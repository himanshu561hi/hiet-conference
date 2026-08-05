import React from 'react';

export const PaperPreviewCard = ({ registration, team }) => {
  const { title, conferenceTrack, paperCategory, authors, version } = registration || {};

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
      <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white relative">
        <span className="absolute top-4 right-4 bg-white/20 px-2 py-1 rounded text-xs font-bold backdrop-blur-sm">
          Version {version || 1}
        </span>
        <h3 className="text-xl font-bold leading-tight line-clamp-3">
          {title || "Untitled Paper"}
        </h3>
        <p className="text-white/80 mt-2 text-sm">
          {conferenceTrack || "No Track Selected"}
        </p>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Category</span>
          <span className="font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">{paperCategory || 'Uncategorized'}</span>
        </div>
        
        <div className="border-t border-gray-100 pt-4">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Authors</span>
          <div className="space-y-3">
            {authors && authors.length > 0 ? authors.map((author, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {author.name ? author.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{author.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{author.role}</p>
                  </div>
                </div>
                {author.isCorresponding && (
                  <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-1 rounded">CORRESPONDING</span>
                )}
              </div>
            )) : (
              <p className="text-sm text-gray-500 italic">No authors initialized yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
