import React from 'react';
import { motion } from 'framer-motion';
import { partnersData } from '../../data/partners';
import { fadeUpVariant, staggerContainer } from '../../animations/sections';

export const PartnerOrganizations = () => {
  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-6 text-center max-w-5xl">
        <motion.div 
          className="mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Partner Organizations
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="text-gray-500 text-lg">
            Collaborating to drive innovation and technical excellence.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {partnersData.map((partner) => (
            <motion.div 
              key={partner.id} 
              variants={fadeUpVariant}
              className="group aspect-video bg-surface rounded-2xl border border-gray-100 flex items-center justify-center p-6 hover:shadow-md hover:border-primary/20 transition-all duration-300"
            >
              {/* Fallback placeholder text until images are added */}
              <span className="font-bold text-gray-400 text-lg md:text-xl text-center group-hover:text-primary transition-colors">
                {partner.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
