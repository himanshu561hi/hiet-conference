import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Download, Sparkles, ArrowRight, ShieldCheck, Award, Users, Globe, BookOpen } from 'lucide-react';
import { Button } from '../ui/Button';
import { Countdown } from './Countdown';
import { homeContent } from '../../content/home';

export const HeroSection = () => {
  const { hero, countdown } = homeContent;

  const featureChips = [
    { label: 'No Registration Fee', icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { label: 'Publication Opportunity', icon: BookOpen, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { label: 'Faculty Mentorship', icon: Users, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { label: 'Inter College Event', icon: Globe, color: 'text-teal-600 bg-teal-50 border-teal-200' },
  ];

  const supportingLogos = [
    { src: '/eventlogo.png', alt: 'NEXUS 2026 Event Logo', label: 'ICDETGT-2026' },
    { src: '/collegelogo.png', alt: 'HIET College Logo', label: 'HIET Ghaziabad' },
    { src: '/edulogo.jpg', alt: 'Education Council Logo', label: 'Academic Council' },
    { src: '/clublogo.png', alt: 'Tech Fusion Club Logo', label: 'Tech Fusion HIET' },
  ];

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/80 py-16 md:py-24 border-b border-slate-200/60">
      
      {/* Dynamic Technology Grid & Floating Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-blue-400/10 blur-[130px] animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-emerald-400/10 blur-[130px] animate-float" style={{ animationDelay: '2.5s' }} />

        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-pattern" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#1e3a8a" strokeWidth="1" />
              <circle cx="0" cy="0" r="2" fill="#059669" />
              <circle cx="48" cy="0" r="2" fill="#2563eb" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-pattern)" />
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column Content */}
          <motion.div 
            className="lg:col-span-7 flex flex-col items-start text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Event Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold tracking-wider uppercase mb-6 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              {hero.association}
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 mb-4 leading-[1.08]">
              NEXUS <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600">2026</span>
            </h1>

            {/* Subtitle */}
            <h2 className="text-xl sm:text-2xl font-bold text-slate-700 mb-3 tracking-tight">
              {hero.subtitle}
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-2xl font-medium leading-relaxed">
              {hero.description || hero.tagline || 'Organized by Tech Fusion, The Official Technical Club of HIET, Ghaziabad.'}
            </p>

            {/* Feature Chips */}
            <div className="flex flex-wrap gap-2.5 mb-8">
              {featureChips.map((chip, idx) => {
                const Icon = chip.icon;
                return (
                  <span 
                    key={idx} 
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-bold shadow-2xs ${chip.color}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {chip.label}
                  </span>
                );
              })}
            </div>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
              <Link to="/register" className="w-full sm:w-auto">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 h-13 rounded-2xl shadow-lg shadow-emerald-600/25 transition-all duration-300 flex items-center justify-center gap-2 group text-base"
                >
                  {hero.primaryCta || hero.cta?.primary || 'Register Now'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <a 
                href={hero.secondaryUrl || hero.cta?.secondaryUrl || "/brochure.pdf"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full sm:w-auto"
              >
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 font-bold px-7 h-13 rounded-2xl shadow-sm transition-all duration-300 flex items-center justify-center gap-2 text-base"
                >
                  <Download className="w-4 h-4 text-emerald-600" />
                  {hero.secondaryCta || hero.cta?.secondary || 'Download Brochure'}
                </Button>
              </a>
            </div>

            {/* Partner Logos Row */}
            <div className="pt-6 border-t border-slate-200/80 w-full">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                In Academic Association With
              </p>
              <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 sm:gap-2.5">
                {supportingLogos.map((logo, idx) => (
                  <div 
                    key={idx} 
                    className="h-10 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1.5 shrink-0 hover:border-emerald-300 transition-colors"
                  >
                    <img src={logo.src} alt={logo.alt} className="max-h-full max-w-[65px] object-contain shrink-0" />
                    <span className="text-[10px] font-bold text-slate-700 font-mono hidden sm:inline-block whitespace-nowrap">
                      {logo.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>

          {/* Right Column: Countdown Card */}
          <motion.div 
            className="lg:col-span-5 flex flex-col justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative">
              {/* Outer Decorative Ring */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 opacity-30 blur-lg" />
              
              <div className="relative bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                
                {/* Event Schedule Info Box */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                  <div>
                    <span className="text-[11px] font-bold font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase">
                      Event Date & Venue
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mt-2">12th September 2026</h3>
                    <p className="text-xs text-slate-500 font-medium">HIET Campus, Ghaziabad (UP)</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center font-black text-xl shadow-inner shrink-0">
                    🏆
                  </div>
                </div>

                {/* Live Countdown Component */}
                <Countdown targetDate="2026-09-12T00:00:00Z" title={countdown.title} />

                {/* Key Event Highlights */}
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Trophies & Certificates for Top Research Papers</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Double-blind Peer Review by Expert Panel</span>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
