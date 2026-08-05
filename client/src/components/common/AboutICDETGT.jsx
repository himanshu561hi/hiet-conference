import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Globe, MonitorPlay, Zap } from 'lucide-react';
import { aboutContent } from '../../content/about';
import { fadeUpVariant, staggerContainer } from '../../animations/sections';

export const AboutICDETGT = () => {
  const { icdetgt } = aboutContent;

  const features = [
    { icon: <BookOpen className="w-6 h-6" />, title: "Scopus Indexed", desc: icdetgt.scopus },
    { icon: <Globe className="w-6 h-6" />, title: "Hybrid Mode", desc: icdetgt.hybrid },
    { icon: <Zap className="w-6 h-6" />, title: "Theme", desc: icdetgt.theme },
    { icon: <MonitorPlay className="w-6 h-6" />, title: "Digital Eng.", desc: "Focus on modern software ecosystems." },
  ];

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.span variants={fadeUpVariant} className="text-blue-600 font-semibold tracking-wider uppercase mb-4 block text-sm">
            In Association With
          </motion.span>
          <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">
            ICDETGT-2026
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="text-lg text-gray-600">
            The International Conference driving global discourse on green technology and digital transformation.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              variants={fadeUpVariant}
              className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-blue-600 mb-4 shadow-sm">
                {feat.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feat.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
