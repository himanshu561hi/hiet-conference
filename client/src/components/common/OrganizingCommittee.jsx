import React from 'react';
import { motion } from 'framer-motion';
import { committeeData } from '../../data/committee';
import { CommitteeCard } from './CommitteeCard';
import { fadeUpVariant, staggerContainer } from '../../animations/sections';

export const OrganizingCommittee = () => {
  return (
    <section className="py-24 bg-surface">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-5xl font-extrabold text-gray-900">
            Organizing Committee
          </motion.h2>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {(committeeData.organizingCommittee || []).map(member => (
            <CommitteeCard key={member.id} member={member} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
