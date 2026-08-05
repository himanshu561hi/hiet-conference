import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Lightbulb, Sparkles } from 'lucide-react';
import { aboutContent } from '../../content/about';
import { achievementsData } from '../../data/achievements';
import { fadeUpVariant, staggerContainer } from '../../animations/sections';

export const AboutTechFusion = () => {
  const { techFusion } = aboutContent;

  return (
    <section className="py-20 md:py-28 bg-white border-b border-slate-200/70 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.span variants={fadeUpVariant} className="inline-block px-3.5 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-widest uppercase mb-3">
            Organizing Club
          </motion.span>
          <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Tech Fusion – Technical Club of HIET
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="text-base md:text-lg text-slate-600 font-medium leading-relaxed">
            {techFusion.mission}
          </motion.p>
        </motion.div>

        {/* Club Showcase Banner with clublogo.png */}
        <div className="mb-14 p-8 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-white p-3 border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
              <img src="/clublogo.png" alt="Tech Fusion Club Logo" className="max-h-full max-w-full object-contain" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-md uppercase tracking-wider">
                Official Student Chapter
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">Empowering Student Researchers</h3>
              <p className="text-slate-600 text-sm font-normal mt-1">Driving innovation, peer workshops, hackathons, and scientific publishing.</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 bg-white border border-slate-200 px-4 py-2 rounded-xl">
            <Sparkles className="w-4 h-4 text-emerald-600" /> HIET Campus Chapter
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievementsData.map((achievement, idx) => (
            <motion.div
              key={achievement.id}
              variants={fadeUpVariant}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center mb-6">
                  {idx === 0 && <Trophy className="w-6 h-6" />}
                  {idx === 1 && <TrendingUp className="w-6 h-6" />}
                  {idx === 2 && <Lightbulb className="w-6 h-6" />}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2.5">{achievement.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-normal">{achievement.description}</p>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-100 text-xs font-semibold text-slate-400">
                Key Milestone
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

