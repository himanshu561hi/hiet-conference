import React from 'react';
import { motion } from 'framer-motion';
import { committeeData } from '../../data/committee';
import { CommitteeCard } from './CommitteeCard';
import { fadeUpVariant, staggerContainer } from '../../animations/sections';

export const PatronsSection = () => {
  return (
    <section className="py-24 bg-surface relative">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.span variants={fadeUpVariant} className="text-primary font-semibold tracking-wider uppercase mb-2 block text-sm">
            Leadership
          </motion.span>
          <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-5xl font-extrabold text-gray-900">
            Patrons & Chairs
          </motion.h2>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {/* Chief Patrons */}
          <div className="mb-16">
            <h3 className="text-center text-xl font-bold text-gray-400 uppercase tracking-widest mb-8">Chief Patrons</h3>
            <div className="flex flex-wrap justify-center gap-6">
              {committeeData.chiefPatrons.map(member => (
                <div key={member.id} className="w-full max-w-sm"><CommitteeCard member={member} /></div>
              ))}
            </div>
          </div>

          {/* Patrons */}
          <div className="mb-16">
            <h3 className="text-center text-xl font-bold text-gray-400 uppercase tracking-widest mb-8">Patrons</h3>
            <div className="flex flex-wrap justify-center gap-6">
              {committeeData.patrons.map(member => (
                <div key={member.id} className="w-full max-w-sm"><CommitteeCard member={member} /></div>
              ))}
            </div>
          </div>

          {/* Conference Chairs & Conveners */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
              <h3 className="text-center text-lg font-bold text-gray-400 uppercase tracking-widest mb-8">Conference Chairs</h3>
              <div className="flex flex-col gap-6">
                {committeeData.conferenceChairs.map(member => (
                  <CommitteeCard key={member.id} member={member} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-center text-lg font-bold text-gray-400 uppercase tracking-widest mb-8">Conveners</h3>
              <div className="flex flex-col gap-6">
                {committeeData.conveners.map(member => (
                  <CommitteeCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
