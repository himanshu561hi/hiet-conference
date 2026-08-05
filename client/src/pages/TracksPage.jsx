import React from 'react';
import { SEO } from '../components/common/SEO';
import { ConferenceTracks } from '../components/common/ConferenceTracks';
import { PublicationSection } from '../components/common/PublicationSection';

export const TracksPage = () => {
  return (
    <>
      <SEO 
        title="Research Tracks | NEXUS 2026" 
        description="Explore research tracks and submission guidelines for NEXUS 2026."
      />
      <div className="bg-gradient-to-b from-slate-50 to-white py-12 md:py-16 border-b border-slate-200">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-widest uppercase mb-4">
            Call for Papers
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight">
            Research Categories & Tracks
          </h1>
          <p className="text-slate-600 text-base md:text-lg font-medium">
            Select your domain of innovation and submit original manuscripts for peer review.
          </p>
        </div>
      </div>
      <ConferenceTracks />
      <PublicationSection />
    </>
  );
};
