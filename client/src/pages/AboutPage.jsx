import React from 'react';
import { SEO } from '../components/common/SEO';
import { AboutNexus } from '../components/common/AboutNexus';
import { AboutTechFusion } from '../components/common/AboutTechFusion';
import { AboutHIET } from '../components/common/AboutHIET';
import { AboutICDETGT } from '../components/common/AboutICDETGT';
import { WhyParticipate } from '../components/common/WhyParticipate';
import { TrustedBy } from '../components/common/TrustedBy';

export const AboutPage = () => {
  return (
    <>
      <SEO 
        title="About | NEXUS 2026" 
        description="Learn about NEXUS 2026, Tech Fusion, HIET, and ICDETGT-2026 research initiatives."
      />
      <div className="bg-gradient-to-b from-slate-50 to-white py-12 md:py-16 border-b border-slate-200">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <span className="inline-block px-3.5 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold tracking-widest uppercase mb-4">
            Institutional Context
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight">
            About NEXUS 2026
          </h1>
          <p className="text-slate-600 text-base md:text-lg font-medium">
            Discover the mission, organizing bodies, and academic vision behind the pre-conference research writing competition.
          </p>
        </div>
      </div>
      <AboutNexus />
      <AboutTechFusion />
      <AboutHIET />
      <AboutICDETGT />
      <WhyParticipate />
      <TrustedBy />
    </>
  );
};
