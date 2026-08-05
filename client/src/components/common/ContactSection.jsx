import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Globe, MessageSquare, Copy, Check, AtSign, Share2 } from 'lucide-react';
import { contactData } from '../../data/contacts';
import { fadeUpVariant, staggerContainer } from '../../animations/sections';
import { toast } from 'react-hot-toast';

export const ContactSection = () => {
  const [copiedKey, setCopiedKey] = useState(null);

  const copyToClipboard = (text, keyLabel) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyLabel);
    toast.success(`Copied ${keyLabel} to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const contactCards = [
    { key: 'Email', label: 'Email Address', value: contactData.conferenceEmail, link: `mailto:${contactData.conferenceEmail}`, icon: Mail, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { key: 'Website', label: 'Official Portal', value: 'hiet-nexus.netlify.app', link: 'https://hiet-nexus.netlify.app/', icon: Globe, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { key: 'Instagram', label: 'Instagram Handle', value: '@hiet.techfusion', link: 'https://www.instagram.com/hiet.techfusion/', icon: AtSign, color: 'text-pink-600 bg-pink-50 border-pink-200' },
    { key: 'LinkedIn', label: 'LinkedIn Page', value: 'hiet-techfusion', link: 'https://www.linkedin.com/company/hiet-techfusion/', icon: Share2, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  ];

  return (
    <section id="contact" className="py-20 md:py-28 bg-gradient-to-b from-white via-slate-50/60 to-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 right-1/4 w-80 h-80 bg-emerald-400/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Primary Contact Info */}
          <motion.div
            className="lg:col-span-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.span variants={fadeUpVariant} className="inline-block px-3.5 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-widest uppercase mb-3">
              Reach Out
            </motion.span>
            <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              Get in Touch
            </motion.h2>
            <motion.p variants={fadeUpVariant} className="text-base text-slate-600 mb-8 font-medium leading-relaxed">
              Have questions about paper submission formatting, track guidelines, or event schedule? Click any card below to copy details directly!
            </motion.p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactCards.map((card) => {
                const Icon = card.icon;
                const isCopied = copiedKey === card.key;
                return (
                  <motion.a 
                    key={card.key}
                    href={card.link}
                    target="_blank"
                    rel="noreferrer"
                    variants={fadeUpVariant}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    onClick={(e) => {
                      copyToClipboard(card.value, card.key);
                    }}
                    className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-emerald-500/40 transition-all duration-300 group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${card.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {isCopied ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{card.label}</h4>
                      <p className="text-slate-600 text-xs font-semibold truncate mt-0.5 group-hover:text-emerald-700 transition-colors">{card.value}</p>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column: Event Coordinators */}
          <motion.div
            className="lg:col-span-7 bg-white p-8 md:p-10 rounded-3xl border border-slate-200/90 shadow-md"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900">Event Coordinators</h3>
                <p className="text-xs font-semibold text-slate-500 mt-1">Direct points of contact for competition queries</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {contactData.coordinators.map(coordinator => (
                <motion.div 
                  key={coordinator.id}
                  variants={fadeUpVariant}
                  onClick={() => copyToClipboard(coordinator.phone, coordinator.name)}
                  className="cursor-pointer bg-slate-50/80 border border-slate-200/70 rounded-2xl p-5 hover:bg-white hover:border-emerald-400/50 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-base font-bold text-slate-900">{coordinator.name}</h4>
                    <Copy className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                  </div>
                  <p className="text-xs font-bold text-emerald-700 mb-3">{coordinator.role}</p>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg w-fit">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{coordinator.phone}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};


