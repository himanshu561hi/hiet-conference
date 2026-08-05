import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Link } from 'react-router-dom';
import { tracks } from '../../data/tracks';
import { fadeUpVariant, staggerContainer } from '../../animations/sections';

export const ConferenceTracks = () => {
  const [activeTrackId, setActiveTrackId] = useState(null);

  return (
    <section id="tracks" className="py-20 md:py-28 bg-gradient-to-b from-slate-50 via-white to-slate-50/80 border-b border-slate-200/70 relative overflow-hidden">
      {/* Ambient background light grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-emerald-400/10 blur-[130px]" />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-blue-400/10 blur-[130px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.span variants={fadeUpVariant} className="inline-block px-3.5 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-widest uppercase mb-3">
            Call for Papers
          </motion.span>
          <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Research Competition Tracks & Subtracks
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="text-base md:text-lg text-slate-600 font-medium">
            Original research papers are invited in the following 6 core interdisciplinary Green Technology domains (T1 – T6).
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {tracks.map((track) => {
            const IconComponent = Icons[track.iconName] || Icons.FileText;
            const isExpanded = activeTrackId === track.id;

            return (
              <motion.div
                key={track.id}
                variants={fadeUpVariant}
                whileHover={{ y: -4, transition: { duration: 0.25, ease: 'easeOut' } }}
                className="group relative bg-white border border-slate-200/90 p-7 sm:p-8 rounded-3xl shadow-2xs hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top indicator bar */}
                <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500 opacity-0 group-hover:opacity-100 rounded-t-full transition-opacity duration-300" />
                
                <div>
                  {/* Track Header */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-2xs">
                      <IconComponent className="w-7 h-7" strokeWidth={1.75} />
                    </div>
                    <span className="text-xs font-black text-emerald-800 tracking-widest uppercase bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full">
                      {track.code}
                    </span>
                  </div>

                  {/* Track Title */}
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
                    {track.name}
                  </h3>
                  
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 font-normal">
                    {track.description}
                  </p>

                  {/* Subtracks Section */}
                  <div className="mb-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Subtracks & Topic Areas ({track.subtracks.length})
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {track.subtracks.slice(0, isExpanded ? track.subtracks.length : 4).map((sub, sIdx) => (
                        <div 
                          key={sIdx}
                          className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50/90 border border-slate-200/70 text-xs font-semibold text-slate-700 hover:bg-emerald-50/60 hover:border-emerald-200 hover:text-emerald-900 transition-all"
                        >
                          <span className="text-emerald-600 font-bold">•</span>
                          <span className="leading-snug">{sub}</span>
                        </div>
                      ))}
                    </div>

                    {track.subtracks.length > 4 && (
                      <button
                        onClick={() => setActiveTrackId(isExpanded ? null : track.id)}
                        className="mt-3 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline focus:outline-none transition-colors"
                      >
                        {isExpanded ? 'Show Fewer Topics ▲' : `+ View All ${track.subtracks.length} Subtracks ▼`}
                      </button>
                    )}
                  </div>
                </div>

                {/* Footer CTA */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span className="text-emerald-700 bg-emerald-50/80 border border-emerald-200 px-3 py-1 rounded-lg">
                    {track.code} Domain
                  </span>
                  <Link to="/register" className="text-emerald-700 font-bold group-hover:text-emerald-600 flex items-center gap-1.5 transition-colors">
                    Submit to {track.code} &rarr;
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};


