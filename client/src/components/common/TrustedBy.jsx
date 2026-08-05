import React from 'react';
import { motion } from 'framer-motion';
import { partnersData } from '../../data/partners';
import { staggerContainer, fadeUpVariant } from '../../animations/sections';

export const TrustedBy = () => {
  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">
          Trusted By Industry Leaders & Institutions
        </p>
        <motion.div 
          className="flex flex-wrap justify-center items-center gap-8 md:gap-16 lg:gap-24"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {partnersData.map((partner) => (
            <motion.div 
              key={partner.id} 
              variants={fadeUpVariant}
              className="group flex flex-col items-center justify-center cursor-default"
            >
              {/* Fallback box for logos since images aren't present yet */}
              <div className="h-12 flex items-center justify-center text-xl font-bold text-gray-300 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:text-primary transition-all duration-300">
                {partner.name}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
