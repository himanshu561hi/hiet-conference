import React from 'react';
import { motion } from 'framer-motion';
import { Target, Compass, Flag, Sparkles } from 'lucide-react';
import { fadeUpVariant, staggerContainer } from '../../animations/sections';

export const AboutNexus = () => {
  const cards = [
    {
      icon: Target,
      title: "Our Mission",
      color: "from-blue-500 to-indigo-500",
      desc: "To cultivate research excellence among undergraduate engineering students by providing a structured peer-reviewed platform for technical manuscript drafting."
    },
    {
      icon: Compass,
      title: "Our Vision",
      color: "from-emerald-500 to-teal-500",
      desc: "To bridge academia and industry research standards, empowering student innovators to publish in international indexed conference proceedings."
    },
    {
      icon: Flag,
      title: "Core Objectives",
      color: "from-purple-500 to-violet-500",
      desc: "Promote IEEE paper formatting mastery, rigorous peer review evaluation, inter-college collaboration, and academic mentorship."
    }
  ];

  return (
    <section id="about" className="py-20 md:py-32 bg-slate-50/80 border-b border-slate-200/70 relative overflow-hidden">
      {/* Background ambient orb */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & Introduction */}
          <motion.div 
            className="lg:col-span-6 flex flex-col"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.span variants={fadeUpVariant} className="inline-block px-3.5 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-bold tracking-widest uppercase mb-4 w-fit">
              About The Competition
            </motion.span>
            
            <motion.h2 variants={fadeUpVariant} className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6 tracking-tight">
              Fostering Academic Excellence & High-Impact Research
            </motion.h2>
            
            <motion.p variants={fadeUpVariant} className="text-slate-600 text-base md:text-lg font-normal leading-relaxed mb-6">
              NEXUS 2026 is an flagship pre-conference research paper writing competition hosted by Tech Fusion — the official technical club of HIET, in association with ICDETGT-2026.
            </motion.p>

            <motion.p variants={fadeUpVariant} className="text-slate-600 text-sm md:text-base font-normal leading-relaxed mb-8">
              Designed as a stepping stone for aspiring researchers, NEXUS 2026 offers comprehensive faculty guidance, IEEE formatting workshops, and publication opportunities for original student research.
            </motion.p>
          </motion.div>

          {/* Right Column: Mission, Vision, Objectives Cards (Receiving the logo scroll transition) */}
          <motion.div 
            className="lg:col-span-6 space-y-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {cards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={idx}
                  variants={fadeUpVariant}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex items-start gap-5"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center shrink-0 shadow-xs`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 mb-1.5">{card.title}</h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{card.desc}</p>
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

