import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeUpVariant } from '../../animations/sections';

export const TrustedBy = () => {
  const logos = [
    { src: '/eventlogo.png', alt: 'NEXUS 2026 Event Logo', label: 'ICDETGT-2026' },
    { src: '/edulogo.jpg', alt: 'Education Partner Logo', label: 'Academic Council' },
    { src: '/clublogo.png', alt: 'Tech Fusion Club Logo', label: 'Tech Fusion HIET' },
  ];

  return (
    <section className="py-10 bg-slate-50/80 border-b border-slate-200/60">
      <div className="container mx-auto px-4 md:px-6">
        <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
          Official Institutional & Academic Affiliations
        </p>
        <motion.div 
          className="flex flex-wrap justify-center items-center gap-6 md:gap-14"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {logos.map((logo, idx) => (
            <motion.div 
              key={idx} 
              variants={fadeUpVariant}
              className="group flex flex-col items-center justify-center"
            >
              <div className="h-16 px-6 py-2 bg-white rounded-xl border border-slate-200 shadow-2xs group-hover:shadow-md group-hover:border-primary/40 flex items-center justify-center transition-all duration-300">
                <img 
                  src={logo.src} 
                  alt={logo.alt} 
                  className="h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-700 transition-colors mt-2">
                {logo.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

