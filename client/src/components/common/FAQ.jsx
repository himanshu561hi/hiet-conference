import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';
import { faqData } from '../../content/faq';
import { fadeUpVariant, staggerContainer } from '../../animations/sections';

export const FAQ = () => {
  const [openId, setOpenId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFaq = faqData.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white via-slate-50/70 to-white border-b border-slate-200/70 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-14"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.span variants={fadeUpVariant} className="inline-block px-3.5 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-bold tracking-widest uppercase mb-3">
            Clear Your Doubts
          </motion.span>
          <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Frequently Asked Questions
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="text-base text-slate-600 font-medium mb-8">
            Find quick answers to common questions about paper formatting, registration eligibility, and submission deadlines.
          </motion.p>

          <motion.div variants={fadeUpVariant} className="relative max-w-xl mx-auto">
            <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search questions by keyword..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white shadow-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm font-medium"
            />
          </motion.div>
        </motion.div>

        <motion.div 
          className="space-y-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {filteredFaq.length > 0 ? (
            filteredFaq.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <motion.div 
                  key={faq.id} 
                  variants={fadeUpVariant}
                  className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen ? 'border-emerald-300 shadow-md ring-2 ring-emerald-500/10' : 'border-slate-200/90 shadow-2xs hover:border-slate-300'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="font-bold text-slate-900 text-base pr-4 flex items-center gap-3">
                      <HelpCircle className={`w-5 h-5 shrink-0 transition-colors ${isOpen ? 'text-primary' : 'text-slate-400'}`} />
                      {faq.question}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100 font-normal">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center text-slate-500 py-10 bg-white border border-slate-200 rounded-2xl">
              No matching questions found for "{searchQuery}".
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

