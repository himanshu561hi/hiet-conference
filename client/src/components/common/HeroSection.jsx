import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Countdown } from './Countdown';
import { homeContent } from '../../content/home';
import { ROUTES } from '../../constants/routes';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export const HeroSection = () => {
  const { hero, countdown } = homeContent;

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-surface py-20">
      {/* Abstract Background Elements (Notion/Linear style) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[100px]" />
        
        {/* Subtle grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40V0H40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center text-center max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-4">
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-6">
              {hero.association}
            </span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-[1.1]"
          >
            {hero.title}
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-600 mb-4 max-w-2xl font-medium"
          >
            {hero.subtitle}
          </motion.p>
          
          <motion.p 
            variants={itemVariants}
            className="text-md md:text-lg text-primary font-medium tracking-wide mb-10"
          >
            {hero.tagline}
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 mb-16">
            <Link to="/register" tabIndex={-1}>
              <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow text-base px-8 h-12">
                {hero.primaryCta}
              </Button>
            </Link>
            <Link to={ROUTES.PUBLIC.ABOUT} tabIndex={-1}>
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/50 backdrop-blur-sm text-base px-8 h-12 border-gray-200">
                {hero.secondaryCta}
              </Button>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full">
            <Countdown targetDate={countdown.targetDate} title={countdown.title} />
          </motion.div>

          {/* Dynamic Logos Section */}
          <motion.div variants={itemVariants} className="mt-20 pt-10 border-t border-gray-200/60 w-full">
            <p className="text-sm font-medium text-gray-500 mb-8 uppercase tracking-widest">
              {hero.organizedBy}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Placeholders for logos (assets/logos/*) */}
              <div className="h-8 md:h-10 flex items-center font-bold text-gray-400 text-xl">[ Tech Fusion Logo ]</div>
              <div className="h-8 md:h-10 flex items-center font-bold text-gray-400 text-xl">[ HIET Logo ]</div>
              <div className="h-8 md:h-10 flex items-center font-bold text-gray-400 text-xl">[ ICDETGT Logo ]</div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};
