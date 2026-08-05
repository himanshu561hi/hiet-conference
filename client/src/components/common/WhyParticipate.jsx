import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FileCode, Users, Presentation, Award, ShieldCheck, Sparkles } from 'lucide-react';
import { fadeUpVariant, staggerContainer } from '../../animations/sections';

export const WhyParticipate = () => {
  const benefits = [
    {
      id: 'b1',
      title: 'Research Methodology',
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-500',
      desc: 'Master academic problem formulations, literature review techniques, and experimental data validation standards.'
    },
    {
      id: 'b2',
      title: 'IEEE Writing Guidelines',
      icon: FileCode,
      color: 'from-emerald-500 to-teal-500',
      desc: 'Learn manuscript drafting in standard double-column IEEE format, citation management, and reference curation.'
    },
    {
      id: 'b3',
      title: 'Faculty Mentorship',
      icon: Users,
      color: 'from-purple-500 to-violet-500',
      desc: 'Receive direct one-on-one review guidance from experienced academic researchers and domain experts.'
    },
    {
      id: 'b4',
      title: 'Paper Presentation',
      icon: Presentation,
      color: 'from-amber-500 to-orange-500',
      desc: 'Present your research before an international panel of judges and gain constructive oral feedback.'
    },
    {
      id: 'b5',
      title: 'Publication Opportunity',
      icon: ShieldCheck,
      color: 'from-teal-500 to-cyan-500',
      desc: 'Accepted high-impact papers receive pre-conference publication in official partner proceedings.'
    },
    {
      id: 'b6',
      title: 'Recognition & Certificate',
      icon: Award,
      color: 'from-indigo-500 to-blue-600',
      desc: 'Earn official certificates of merit, publication awards, and recognition for your resume.'
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
          <motion.span variants={fadeUpVariant} className="inline-block px-3.5 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-widest uppercase mb-3">
            Why Participate
          </motion.span>
          <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Accelerate Your Research Journey
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="text-base md:text-lg text-slate-600 font-medium">
            Gain invaluable research experience, formal publication credentials, and mentorship from leading academics.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            
            return (
              <motion.div
                key={benefit.id}
                variants={fadeUpVariant}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group bg-gradient-to-b from-slate-50/80 to-white p-7 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.color} text-white flex items-center justify-center shadow-md mb-6 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-7 h-7" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2.5 group-hover:text-emerald-700 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-normal">
                    {benefit.desc}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <Sparkles className="w-3.5 h-3.5" /> Conference Standard
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

