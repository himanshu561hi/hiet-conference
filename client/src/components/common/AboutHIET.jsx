import React from 'react';
import { motion } from 'framer-motion';
import { instituteData } from '../../data/institute';
import { statsData } from '../../data/stats';
import { fadeUpVariant, staggerContainer } from '../../animations/sections';

export const AboutHIET = () => {
  return (
    <section className="py-20 md:py-32 bg-gray-900 text-white relative overflow-hidden">
      {/* Dark background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dot-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-pattern)" />
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-5xl font-extrabold mb-8">
              Hi-Tech Institute of <br /><span className="text-primary">Engineering Technology</span>
            </motion.h2>
            <motion.p variants={fadeUpVariant} className="text-gray-300 text-lg leading-relaxed mb-6">
              {instituteData.overview}
            </motion.p>
            <motion.p variants={fadeUpVariant} className="text-gray-400 leading-relaxed mb-10">
              {instituteData.research} {instituteData.campus}
            </motion.p>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-800">
              {statsData.map((stat, i) => (
                <motion.div key={stat.id} variants={fadeUpVariant}>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="h-[500px] rounded-2xl bg-gray-800 border border-gray-700 overflow-hidden relative shadow-2xl flex items-center justify-center"
          >
            {/* Architecture Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10" />
            <div className="text-gray-600 font-bold text-2xl z-20">[ Campus Image Placeholder ]</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
