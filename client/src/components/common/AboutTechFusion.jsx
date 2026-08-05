import React from 'react';
import { motion } from 'framer-motion';
import { Target, Lightbulb, TrendingUp, Trophy } from 'lucide-react';
import { aboutContent } from '../../content/about';
import { achievementsData } from '../../data/achievements';
import { fadeUpVariant, staggerContainer } from '../../animations/sections';
import { cardHoverVariant } from '../../animations/cards';

export const AboutTechFusion = () => {
  const { techFusion } = aboutContent;

  return (
    <section className="py-20 md:py-32 bg-white relative">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.span variants={fadeUpVariant} className="text-primary font-semibold tracking-wider uppercase mb-4 block text-sm">
            Organizers
          </motion.span>
          <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Tech Fusion
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="text-lg text-gray-600">
            {techFusion.mission}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievementsData.map((achievement, idx) => (
            <motion.div
              key={achievement.id}
              variants={cardHoverVariant}
              initial="rest"
              whileHover="hover"
              className="bg-surface rounded-2xl p-8 border border-gray-100 flex flex-col items-start"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                {idx === 0 && <Trophy className="w-6 h-6" />}
                {idx === 1 && <TrendingUp className="w-6 h-6" />}
                {idx === 2 && <Lightbulb className="w-6 h-6" />}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{achievement.title}</h3>
              <p className="text-gray-600 leading-relaxed">{achievement.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
