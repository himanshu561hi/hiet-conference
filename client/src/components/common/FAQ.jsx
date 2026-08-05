import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';
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
    <section className="py-24 bg-surface border-y border-gray-100">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <motion.div 
          className="text-center mb-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.span variants={fadeUpVariant} className="text-primary font-semibold tracking-wider uppercase mb-4 block text-sm">
            Got Questions?
          </motion.span>
          <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Frequently Asked Questions
          </motion.h2>

          <motion.div variants={fadeUpVariant} className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search questions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow shadow-sm bg-white"
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
            filteredFaq.map((faq) => (
              <motion.div 
                key={faq.id} 
                variants={fadeUpVariant}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full px-6 py-5 flex items-center justify-between focus:outline-none focus-visible:bg-gray-50"
                  aria-expanded={openId === faq.id}
                >
                  <span className="text-left font-bold text-gray-900 pr-4">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${openId === faq.id ? 'rotate-180 text-primary' : ''}`} />
                </button>
                <AnimatePresence>
                  {openId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 pt-1 text-gray-600 leading-relaxed border-t border-gray-50">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">No results found for "{searchQuery}".</div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
