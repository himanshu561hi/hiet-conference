import React from 'react';
import { motion } from 'framer-motion';
import { instituteData } from '../../data/institute';
import { statsData } from '../../data/stats';
import { fadeUpVariant, staggerContainer } from '../../animations/sections';

export const AboutHIET = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white via-slate-50/70 to-white border-b border-slate-200/70 relative overflow-hidden">
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <motion.div
            className="lg:col-span-7"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.span variants={fadeUpVariant} className="inline-block px-3.5 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-bold tracking-widest uppercase mb-4">
              Academic Institution
            </motion.span>
            
            <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
              Hi-Tech Institute of <br /><span className="text-primary">Engineering & Technology</span>
            </motion.h2>
            
            <motion.p variants={fadeUpVariant} className="text-slate-600 text-base md:text-lg leading-relaxed mb-6 font-normal">
              {instituteData.overview}
            </motion.p>
            
            <motion.p variants={fadeUpVariant} className="text-slate-600 text-sm md:text-base leading-relaxed mb-10 font-normal">
              {instituteData.research} {instituteData.campus}
            </motion.p>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-200">
              {statsData.map((stat) => (
                <motion.div key={stat.id} variants={fadeUpVariant} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="text-3xl md:text-4xl font-black text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="lg:col-span-5 h-[380px] sm:h-[450px] rounded-3xl bg-white border border-slate-200/90 p-8 shadow-xl shadow-slate-200/70 flex items-center justify-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-emerald-500/5 to-transparent pointer-events-none" />
            <img 
              src="/collegelogo.png" 
              alt="HIET College Logo" 
              className="max-h-full max-w-full object-contain filter drop-shadow-md relative z-10 p-4"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

