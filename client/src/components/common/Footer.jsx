import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowUp, Sparkles } from 'lucide-react';
import { brandingConfig } from '../../config/branding';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const logos = [
    { src: '/eventlogo.png', alt: 'NEXUS 2026 Event Logo', title: 'ICDETGT-2026' },
    { src: '/edulogo.jpg', alt: 'Education Council Logo', title: 'Academic Council' },
    { src: '/clublogo.png', alt: 'Tech Fusion Club Logo', title: 'Tech Fusion HIET' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-10 border-t border-slate-800 relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
      
      <div className="container mx-auto px-4 md:px-6">
        {/* Footer Partner Logos Row */}
        <div className="mb-14 pb-10 border-b border-slate-800">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-6">
            Institutional & Conference Partners
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {logos.map((logo, index) => (
              <div 
                key={index}
                className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-700 shadow-sm flex items-center justify-center h-14 sm:h-16 w-32 sm:w-40 hover:border-emerald-500/60 hover:scale-105 transition-all duration-300"
              >
                <img 
                  src={logo.src} 
                  alt={logo.alt} 
                  className="max-h-full max-w-full object-contain filter hover:brightness-105 transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-14">
          
          {/* Brand Info */}
          <div className="lg:col-span-1 flex flex-col items-start">
            <Link to="/" className="text-2xl font-black tracking-tight mb-4 flex items-center gap-2">
              NEXUS<span className="text-primary font-bold">2026</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              {brandingConfig.tagline}
            </p>
            <div className="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1">
              Organized By
            </div>
            <div className="font-bold text-slate-200 text-sm">
              {brandingConfig.organization.name}
            </div>
            <div className="text-xs text-slate-400">
              {brandingConfig.organization.club}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" /> Navigation
            </h4>
            <ul className="space-y-3 text-slate-400 text-sm font-medium">
              <li><a href="#home" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="#timeline" className="hover:text-primary transition-colors">Timeline</a></li>
              <li><a href="#tracks" className="hover:text-primary transition-colors">Conference Tracks</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contact Us</a></li>
              <li><Link to="/register" className="text-primary hover:underline flex items-center gap-1 font-semibold"><Sparkles className="w-3.5 h-3.5" /> Event Registration</Link></li>
            </ul>
          </div>

          {/* Competition Resources */}
          <div>
            <h4 className="text-white font-bold text-base mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> Competition Info
            </h4>
            <ul className="space-y-3 text-slate-400 text-sm font-medium">
              <li>
                <a href="#timeline" className="hover:text-primary transition-colors inline-flex items-center gap-1">
                  Submission Deadlines
                </a>
              </li>
              <li><a href="#tracks" className="hover:text-primary transition-colors">Research Categories</a></li>
              <li><Link to="/auth/login" className="hover:text-primary transition-colors">Author Portal Login</Link></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400" /> Connect
            </h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Stay updated with call for paper notifications and acceptance announcements.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {Object.entries(brandingConfig.socialLinks).map(([platform, link]) => (
                <a 
                  key={platform} 
                  href={link} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-emerald-600 hover:text-white transition-all capitalize text-xs font-bold border border-slate-700/80 flex items-center gap-1"
                >
                  {platform}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Copyright & Scroll Top */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs font-medium text-center sm:text-left">
            &copy; {currentYear} {brandingConfig.appName}. Research Paper Writing Competition. All rights reserved.
          </p>
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-primary transition-colors focus:outline-none group"
          >
            Back to top
            <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all">
              <ArrowUp className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};

