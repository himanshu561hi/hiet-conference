import React from 'react';
import { SEO } from '../components/common/SEO';
import { ImportantDates } from '../components/common/ImportantDates';
import { RegistrationFlow } from '../components/common/RegistrationFlow';
import { Countdown } from '../components/common/Countdown';
import { homeContent } from '../content/home';

export const TimelinePage = () => {
  const { countdown } = homeContent;

  return (
    <>
      <SEO 
        title="Timeline & Schedule | NEXUS 2026" 
        description="Important dates, deadlines, and registration workflow for NEXUS 2026."
      />
      <div className="bg-gradient-to-b from-slate-50 to-white py-12 md:py-16 border-b border-slate-200">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <span className="inline-block px-3.5 py-1 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-800 text-xs font-bold tracking-widest uppercase mb-4">
            Event Schedule
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight">
            Timeline & Registration Flow
          </h1>
          <p className="text-slate-600 text-base md:text-lg font-medium mb-8">
            Stay on track with submission deadlines, review phases, and presentation schedules.
          </p>

          <div className="max-w-2xl mx-auto">
            <Countdown targetDate={countdown.targetDate} title={countdown.title} />
          </div>
        </div>
      </div>
      <ImportantDates />
      <RegistrationFlow />
    </>
  );
};
