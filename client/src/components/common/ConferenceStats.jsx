import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { highlightsContent } from '../../content/highlights';
import { fadeUpVariant, staggerContainer } from '../../animations/sections';

const Counter = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <span>{count}</span>;
};

export const ConferenceStats = () => {
  const { statistics } = highlightsContent;

  return (
    <section className="py-20 bg-primary relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-stats" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40V0H40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-stats)" />
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {statistics.metrics.map((stat) => (
            <motion.div 
              key={stat.id} 
              variants={fadeUpVariant}
              className="flex flex-col items-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl"
            >
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2 flex items-center">
                <Counter end={stat.value} />
                <span className="text-blue-200 ml-1">+</span>
              </div>
              <div className="text-sm md:text-base font-medium text-blue-100 uppercase tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
