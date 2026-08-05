import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { timelineData } from '../../data/timeline';
import { fadeUpVariant, staggerContainer } from '../../animations/sections';

export const ImportantDates = () => {
  return (
    <section className="py-24 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <motion.div 
          className="text-center mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Important Dates
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="text-lg text-gray-600">
            Keep track of the submission deadlines and conference schedule.
          </motion.p>
        </motion.div>

        <div className="relative border-l-2 border-gray-100 ml-4 md:ml-0 md:border-none">
          {/* Central Line for Desktop */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-100 -translate-x-1/2" />
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >
            {timelineData.map((item, index) => {
              const isEven = index % 2 === 0;
              const isPast = item.status === 'past';
              const isCurrent = item.status === 'current';
              
              return (
                <motion.div 
                  key={item.id} 
                  variants={fadeUpVariant}
                  className={`relative flex items-center md:justify-between w-full ${isEven ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute -left-6 md:left-1/2 w-10 h-10 rounded-full bg-white border-4 flex items-center justify-center md:-translate-x-1/2 shadow-sm z-10 
                    ${isPast ? 'border-gray-300 text-gray-400' : isCurrent ? 'border-primary text-primary' : 'border-blue-100 text-blue-300'}"
                  >
                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>

                  {/* Empty space for alternating layout on desktop */}
                  <div className="hidden md:block md:w-5/12" />

                  {/* Card Content */}
                  <div className="ml-8 md:ml-0 md:w-5/12 bg-surface p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4
                      ${isPast ? 'bg-gray-100 text-gray-500' : isCurrent ? 'bg-primary/10 text-primary' : 'bg-blue-50 text-blue-600'}">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.date}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">{item.description}</p>
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
