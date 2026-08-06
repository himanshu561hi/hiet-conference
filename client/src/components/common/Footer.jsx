import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowUp, Mail, Globe, MessageCircle, MapPin, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const logos = [
    { src: '/eventlogo.png', alt: 'NEXUS 2026 Event Logo', title: 'ICDETGT-2026' },
    { src: '/collegelogo.png', alt: 'HIET College Logo', title: 'HIET Ghaziabad' },
    { src: '/edulogo.jpg', alt: 'Education Council Logo', title: 'Academic Council' },
    { src: '/clublogo.png', alt: 'Tech Fusion Club Logo', title: 'Tech Fusion HIET' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-700 py-12 font-sans relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Partner Logos Row */}
        <div className="flex flex-wrap items-center justify-between gap-6 pb-10 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold font-mono uppercase text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full">
              NEXUS 2026 Official Partners
            </span>
            <p className="text-xs text-slate-500 mt-1.5">Organized by HIET Ghaziabad & Tech Fusion Student Club</p>
          </div>

          <div className="flex items-center gap-6">
            {logos.map((logo, idx) => (
              <div key={idx} className="h-12 bg-slate-50 border border-slate-200 rounded-xl p-2 flex items-center justify-center shadow-sm">
                <img src={logo.src} alt={logo.alt} className="max-h-full max-w-full object-contain" />
              </div>
            ))}
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          <div>
            <h4 className="text-base font-extrabold text-slate-900 mb-3">NEXUS 2026</h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              International Conference & Research Paper Writing Competition on Green Technologies & Intelligent Systems.
            </p>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Free Author Registration
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 font-mono">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#about" className="hover:text-emerald-600 transition">About Conference</a></li>
              <li><a href="#tracks" className="hover:text-emerald-600 transition">Research Tracks</a></li>
              <li><a href="#dates" className="hover:text-emerald-600 transition">Important Dates</a></li>
              <li><a href="#committee" className="hover:text-emerald-600 transition">Editorial Board</a></li>
              <li><Link to="/register" className="text-emerald-700 font-bold hover:underline">Submit Paper PDF →</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 font-mono">Conference Tracks</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="text-slate-600">Track 1: Green AI & Systems</span></li>
              <li><span className="text-slate-600">Track 2: Renewable Energy Tech</span></li>
              <li><span className="text-slate-600">Track 3: Smart Cities & IoT</span></li>
              <li><span className="text-slate-600">Track 4: Eco Green Materials</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 font-mono">Contact & Venue</h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <a href="mailto:techfusion9560@gmail.com" className="hover:text-emerald-600">techfusion9560@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                <a href="https://www.linkedin.com/company/hiet-techfusion/" target="_blank" rel="noreferrer" className="hover:text-slate-900 font-medium">Tech Fusion LinkedIn Page</a>
              </li>
              <li className="flex items-start gap-2 pt-1">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>HIET Campus, Ghaziabad, UP 201015</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright & Scroll Top */}
        <div className="pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {currentYear} NEXUS 2026 — HIET Ghaziabad. All rights reserved.</p>
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors font-semibold"
          >
            Back to top
            <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
              <ArrowUp className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>

      </div>
    </footer>
  );
};
