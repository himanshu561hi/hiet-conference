import React from 'react';
import { motion } from 'framer-motion';
import { Award, BookOpen, Medal, Star, CheckCircle, Sparkles } from 'lucide-react';
import { fadeUpVariant, staggerContainer } from '../../animations/sections';

export const AwardsSection = () => {
  const awards = [
    {
      title: "Best Research Paper Award",
      prize: "Trophy & Certificate of Excellence",
      desc: "Awarded to the top paper exhibiting outstanding technical depth, novelty, and experimental rigor.",
      icon: Award,
      badge: "1st Place",
      color: "from-amber-500 to-orange-500"
    },
    {
      title: "Best Presentation Award",
      prize: "Trophy & Special Citation",
      desc: "Recognizing exceptional presentation clarity, slide design, and Q&A handling during track sessions.",
      icon: Medal,
      badge: "Oral Excellence",
      color: "from-blue-500 to-indigo-500"
    },
    {
      title: "Publication Opportunity",
      prize: "Pre-Conference Proceedings",
      desc: "Accepted high-quality research manuscripts receive direct indexing and publication opportunities.",
      icon: BookOpen,
      badge: "Indexing",
      color: "from-emerald-500 to-teal-500"
    }
  ];

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
          <motion.span variants={fadeUpVariant} className="inline-block px-3.5 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold tracking-widest uppercase mb-3">
            Recognition & Honors
          </motion.span>
          <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Awards & Recognition
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="text-base md:text-lg text-slate-600 font-medium">
            Outstanding contributions will be honored with prestigious certificates, trophies, and publication indexing.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {awards.map((award, index) => {
            const Icon = award.icon;
            return (
              <motion.div
                key={index}
                variants={fadeUpVariant}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className="bg-gradient-to-b from-slate-50 to-white border border-slate-200/90 rounded-3xl p-8 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-slate-200/40 to-transparent rounded-bl-full pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${award.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
                      {award.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 mb-2">{award.title}</h3>
                  <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-4 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> {award.prize}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 font-normal">
                    {award.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-500">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Official Certificate Issued</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
