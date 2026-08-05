import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { timelineData } from '../../data/timeline';
import { fadeUpVariant, staggerContainer } from '../../animations/sections';

export const ImportantDates = () => {
  return (
    <section id="timeline" className="py-20 md:py-28 bg-gradient-to-b from-white via-slate-50/50 to-white border-b border-slate-200/60 relative overflow-hidden">
      {/* Background glowing ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 max-w-5xl relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.span variants={fadeUpVariant} className="inline-block px-3.5 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-widest uppercase mb-3">
            Official Schedule
          </motion.span>
          <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Important Dates & Deadlines
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="text-base md:text-lg text-slate-600 font-medium">
            Mark your calendar with the official submission milestones for NEXUS 2026.
          </motion.p>
        </motion.div>

        {/* Quick Summary Table for Mobile & Desktop */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8 overflow-x-auto"
        >
          <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Key Competition Milestones</h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">Summary schedule for research authors</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              Official Schedule
            </span>
          </div>

          <table className="w-full text-left border-collapse min-w-[320px]">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-black uppercase text-slate-400 tracking-wider">
                <th className="py-3 px-3">Activity</th>
                <th className="py-3 px-3 text-right sm:text-left">Proposed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-800">
              {timelineData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-3 flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{row.title}</span>
                  </td>
                  <td className="py-3.5 px-3 text-right sm:text-left font-bold text-emerald-800">
                    <span className="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg inline-block">
                      {row.date}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Timeline Visual Cards */}
        <div className="relative border-l-2 border-slate-200/80 ml-4 md:ml-0 md:border-none">
          {/* Central Connecting Line for Desktop */}
          <div className="hidden md:block absolute top-4 bottom-4 left-1/2 w-0.5 bg-gradient-to-b from-slate-200 via-emerald-500/40 to-slate-200 -translate-x-1/2" />
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8 md:space-y-10"
          >
            {timelineData.map((item, index) => {
              const isEven = index % 2 === 0;
              const isPast = item.status === 'past';
              const isCurrent = item.status === 'current';
              
              return (
                <motion.div 
                  key={item.id} 
                  variants={fadeUpVariant}
                  className={`relative flex items-center md:justify-between w-full ${isEven ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Timeline Node Icon */}
                  <div className={`absolute -left-5 md:left-1/2 w-10 h-10 rounded-full bg-white border-4 flex items-center justify-center md:-translate-x-1/2 shadow-md z-10 transition-all duration-300 ${
                    isPast 
                      ? 'border-emerald-500 text-emerald-600 shadow-emerald-500/20' 
                      : isCurrent 
                      ? 'border-primary text-primary shadow-primary/30 ring-4 ring-primary/10' 
                      : 'border-slate-300 text-slate-400'
                  }`}>
                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : isCurrent ? <Clock className="w-5 h-5 animate-pulse" /> : <Calendar className="w-4 h-4" />}
                  </div>

                  {/* Desktop spacer */}
                  <div className="hidden md:block md:w-5/12" />

                  {/* Event Milestone Card */}
                  <div className={`ml-8 md:ml-0 md:w-5/12 p-6 rounded-3xl border transition-all duration-300 shadow-xs hover:shadow-lg hover:-translate-y-1 ${
                    isCurrent 
                      ? 'bg-white border-emerald-400 ring-2 ring-emerald-500/10 shadow-emerald-500/10' 
                      : 'bg-white/90 backdrop-blur-xs border-slate-200/80 hover:border-slate-300'
                  }`}>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider ${
                        isPast 
                          ? 'bg-slate-100 text-slate-600' 
                          : isCurrent 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : 'bg-blue-50 text-blue-700'
                      }`}>
                        <Calendar className="w-3.5 h-3.5" />
                        {item.date}
                      </span>
                      {isCurrent && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          <AlertCircle className="w-3 h-3 text-emerald-600" /> Active Stage
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed font-normal">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};


