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
    { src: '/edulogo.jpg', alt: 'Education Council Logo', label: 'Academic Council' },
    { src: '/clublogo.png', alt: 'Tech Fusion Club Logo', label: 'Tech Fusion HIET' },
  ];

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/80 py-16 md:py-24 border-b border-slate-200/60">
      
      {/* Dynamic Technology Grid & Floating Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-blue-400/10 blur-[130px] animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-emerald-400/10 blur-[130px] animate-float" style={{ animationDelay: '2.5s' }} />

        {/* Abstract Technology Grid */}
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
              Pre-Conference Research Paper Writing Competition
            </h2>

            {/* Tagline */}
            <p className="text-base sm:text-lg text-primary font-bold tracking-wide mb-8 bg-emerald-50/80 border border-emerald-200/80 px-4.5 py-1.5 rounded-full">
              Research • Write • Connect • Publish
            </p>

            {/* Quick Feature Chips */}
            <div className="flex flex-wrap items-center gap-2.5 mb-10">
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

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              <Link to="/register" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto text-base font-bold px-8 h-13 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 group">
                  Register Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <a 
                href="/assets/documents/nexus-2026-brochure.pdf" 
                target="_blank" 
                rel="noreferrer"
                className="w-full sm:w-auto"
              >
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white border-slate-300 hover:border-slate-400 text-slate-800 text-base font-semibold px-6 h-13 rounded-2xl flex items-center justify-center gap-2">
                  <Download className="w-4 h-4 text-blue-600" /> Download Brochure
                </Button>
              </a>

              <a href="#tracks" className="w-full sm:w-auto">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto text-slate-600 hover:text-slate-900 text-base font-semibold px-5 h-13 rounded-2xl">
                  View Guidelines
                </Button>
              </a>
            </div>

            {/* Countdown Banner */}
            <div className="w-full max-w-2xl">
              <Countdown targetDate={countdown.targetDate} title={countdown.title} />
            </div>

          </motion.div>

          {/* Right Column: Hero Event Logo (Fixed in hero with float animation, no scroll-jacking) */}
          <motion.div 
            className="lg:col-span-5 flex flex-col items-center justify-center relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-blue-500/15 via-emerald-500/15 to-indigo-500/15 blur-3xl" />
            
            <div className="relative z-10 w-72 sm:w-80 lg:w-96 h-72 sm:h-80 lg:h-96 bg-white border border-slate-200/90 rounded-3xl p-8 shadow-xl shadow-slate-200/70 flex items-center justify-center animate-float">
              <img 
                src="/eventlogo.png" 
                alt="NEXUS 2026 Official Logo" 
                className="max-h-full max-w-full object-contain filter drop-shadow-md"
              />
            </div>
          </motion.div>

        </div>

        {/* Supporting Partners & Club Banner (eventlogo, edulogo, clublogo) */}
        <div className="mt-16 pt-8 border-t border-slate-200/70 w-full">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-6">
            Organized By Tech Fusion Club & Academic Partners
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {supportingLogos.map((logo, idx) => (
              <div 
                key={idx}
                className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-emerald-500/40 flex items-center justify-center h-16 w-36 sm:w-44 hover:-translate-y-1 transition-all duration-300 group"
              >
                <img 
                  src={logo.src} 
                  alt={logo.alt} 
                  className="max-h-full max-w-full object-contain filter group-hover:brightness-105 transition-all"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};



