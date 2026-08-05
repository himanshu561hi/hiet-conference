import React from 'react';
import { SEO } from '../components/common/SEO';
import { ContactSection } from '../components/common/ContactSection';
import { FAQ } from '../components/common/FAQ';

export const ContactPage = () => {
  return (
    <>
      <SEO 
        title="Contact Us | NEXUS 2026" 
        description="Contact the NEXUS 2026 organising committee and coordinators."
      />
      <div className="bg-gradient-to-b from-slate-50 to-white py-12 md:py-16 border-b border-slate-200">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <span className="inline-block px-3.5 py-1 rounded-full bg-teal-100 border border-teal-200 text-teal-800 text-xs font-bold tracking-widest uppercase mb-4">
            Support & Inquiry
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight">
            Contact Organising Committee
          </h1>
          <p className="text-slate-600 text-base md:text-lg font-medium">
            Have questions about your submission or event attendance? Reach out to our team.
          </p>
        </div>
      </div>
      <ContactSection />
      <FAQ />
    </>
  );
};
