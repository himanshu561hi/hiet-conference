import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { highlightsContent } from '../../content/highlights';
import { fadeUpVariant, staggerContainer } from '../../animations/sections';
import { cardHoverVariant } from '../../animations/cards';

export const WhyParticipate = () => {
  const { participation } = highlightsContent;

  return (
    <section className="py-24 bg-surface">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">
            {participation.heading}
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="text-lg text-gray-600">
            {participation.description}
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {participation.benefits.map((benefit) => {
            const IconComponent = Icons[benefit.icon] || Icons.CheckCircle;
            
            return (
              <motion.div
                key={benefit.id}
                variants={cardHoverVariant}
                initial="rest"
                whileHover="hover"
                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-start"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <IconComponent className="w-7 h-7" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
