import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, MailCheck, LogIn, FileText, CheckSquare, FileCode, Presentation, Award, ArrowRight, Calendar } from 'lucide-react';
import { fadeUpVariant, staggerContainer } from '../../animations/sections';

export const RegistrationFlow = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { id: 1, title: 'Registration Opens', date: '06/08/2026', desc: 'Portal opens for author team registration', icon: UserPlus, color: 'from-emerald-500 to-teal-500' },
    { id: 2, title: 'Email Verification', date: 'Active', desc: 'Instant OTP & account activation', icon: MailCheck, color: 'from-teal-500 to-cyan-500' },
    { id: 3, title: 'Portal Login', date: 'Active', desc: 'Access author dashboard & submission templates', icon: LogIn, color: 'from-cyan-500 to-blue-500' },
    { id: 4, title: 'Abstract Deadline', date: '31/08/2026', desc: 'Submit title, abstract (150-300 words) & track', icon: FileText, color: 'from-blue-500 to-indigo-500' },
    { id: 5, title: 'Peer Review', date: '01/09/2026', desc: 'Blind peer review by expert committee', icon: CheckSquare, color: 'from-indigo-500 to-violet-500' },
    { id: 6, title: 'Shortlisting Result', date: '06/09/2026', desc: 'Notification of shortlisting & acceptance', icon: Award, color: 'from-violet-500 to-purple-500' },
    { id: 7, title: 'Final Full Paper', date: '12/09/2026', desc: 'Upload IEEE formatted full camera-ready paper', icon: FileCode, color: 'from-purple-500 to-fuchsia-500' },
    { id: 8, title: 'Presentation & Award', date: 'Event Day', desc: 'Present paper & receive publication certificates', icon: Presentation, color: 'from-fuchsia-500 to-emerald-500' },
  ];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white via-slate-50 to-white border-b border-slate-200/70 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.span variants={fadeUpVariant} className="inline-block px-3.5 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-widest uppercase mb-3">
            Author Journey & Milestones
          </motion.span>
          <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Registration & Submission Flow
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="text-base md:text-lg text-slate-600 font-medium">
            Follow our 8-step submission workflow integrated with key competition deadline dates.
          </motion.p>
        </motion.div>

        {/* Steps Grid / Timeline - Fully Responsive for Mobile & Desktop */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === idx;
            
            return (
              <motion.div
                key={step.id}
                variants={fadeUpVariant}
                onClick={() => setActiveStep(idx)}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={`cursor-pointer p-6 rounded-3xl border transition-all duration-300 relative flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-white border-emerald-500 shadow-xl ring-2 ring-emerald-500/20' 
                    : 'bg-white/90 border-slate-200/90 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {/* Step badge & Date */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`w-8 h-8 rounded-xl font-extrabold text-xs flex items-center justify-center ${
                    isSelected ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                  }`}>
                    0{step.id}
                  </span>
                  
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold">
                    <Calendar className="w-3 h-3 text-emerald-600" />
                    {step.date}
                  </span>
                </div>

                <div className="mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center shadow-md mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mb-1.5">{step.title}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed font-normal">{step.desc}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                  <span>Phase {idx + 1} of 8</span>
                  <span className={isSelected ? 'text-emerald-600 font-bold' : ''}>
                    {isSelected ? 'Selected' : 'View'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

