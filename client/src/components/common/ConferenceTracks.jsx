import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { tracks } from '../../data/tracks';
import { fadeUpVariant, staggerContainer } from '../../animations/sections';

export const ConferenceTracks = () => {
  return (
    <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.span variants={fadeUpVariant} className="text-primary font-semibold tracking-wider uppercase mb-4 block text-sm">
            Call for Papers
          </motion.span>
          <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-5xl font-extrabold mb-6">
            Conference Tracks
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="text-gray-400 text-lg">
            Submissions are invited in the following core areas of research and innovation.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {tracks.map((track, index) => {
            const IconComponent = Icons[track.iconName] || Icons.FileText;
            
            return (
              <motion.div
                key={track.id}
                variants={fadeUpVariant}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group relative bg-gray-800 border border-gray-700 p-8 rounded-2xl overflow-hidden hover:border-primary/50 transition-colors duration-300"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10 flex items-start gap-6">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gray-900 flex items-center justify-center text-primary border border-gray-700 group-hover:border-primary/30 transition-colors">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-widest">
                      Track 0{index + 1}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{track.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{track.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
