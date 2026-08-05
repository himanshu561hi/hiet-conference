import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { highlightsContent } from '../../content/highlights';
import { fadeUpVariant, staggerContainer } from '../../animations/sections';

export const PublicationSection = () => {
  const { publication } = highlightsContent;

  return (
    <section className="py-24 bg-white border-y border-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <motion.div 
            className="lg:col-span-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">
              {publication.heading}
            </motion.h2>
            <motion.p variants={fadeUpVariant} className="text-lg text-gray-600 mb-8">
              {publication.description}
            </motion.p>
            {/* Publisher Logo Placeholder */}
            <motion.div variants={fadeUpVariant} className="h-16 w-48 bg-surface border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 font-bold text-lg grayscale opacity-70">
              [ Bentham Science ]
            </motion.div>
          </motion.div>

          <motion.div 
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {publication.features.map((feature) => {
              const IconComponent = Icons[feature.icon] || Icons.Star;
              return (
                <motion.div
                  key={feature.id}
                  variants={fadeUpVariant}
                  className="p-6 rounded-2xl bg-surface border border-gray-100 flex flex-col gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <IconComponent className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
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
