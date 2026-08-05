import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { aboutContent } from '../../content/about';
import { Button } from '../ui/Button';
import { fadeUpVariant, staggerContainer } from '../../animations/sections';

export const AboutNexus = () => {
  const { nexus } = aboutContent;

  return (
    <section className="py-20 md:py-32 bg-surface overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col"
          >
            <motion.span variants={fadeUpVariant} className="text-primary font-semibold tracking-wider uppercase mb-4 text-sm">
              About Nexus
            </motion.span>
            <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              {nexus.heading}
            </motion.h2>
            <motion.p variants={fadeUpVariant} className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
              {nexus.description}
            </motion.p>
            
            <motion.div variants={fadeUpVariant} className="flex flex-wrap gap-4">
              {nexus.buttons.map((btn, idx) => (
                <Link key={idx} to={btn.href} tabIndex={-1}>
                  <Button variant={btn.variant} size="lg" className={btn.variant === 'primary' ? 'shadow-lg' : 'bg-white'}>
                    {btn.label}
                  </Button>
                </Link>
              ))}
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative h-[400px] lg:h-[500px] rounded-2xl bg-gradient-to-br from-primary/10 to-blue-500/10 border border-white/40 shadow-2xl flex items-center justify-center overflow-hidden"
          >
            {/* Minimal SVG Illustration Placeholder */}
            <div className="absolute inset-0 bg-white/20 backdrop-blur-xl" />
            <svg className="w-64 h-64 text-primary opacity-20 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
