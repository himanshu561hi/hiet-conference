import React from 'react';
import { motion } from 'framer-motion';
import { DownloadCloud } from 'lucide-react';
import { highlightsContent } from '../../content/highlights';
import { conferenceConfig } from '../../config/conference';
import { Button } from '../ui/Button';

export const BrochureCTA = () => {
  const { brochure } = highlightsContent;

  return (
    <section className="py-24 bg-surface relative overflow-hidden">
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-primary rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden"
        >
          {/* Abstract blobs inside the card */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
              {brochure.heading}
            </h2>
            <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              {brochure.description}
            </p>
            <a href={conferenceConfig.brochureUrl} target="_blank" rel="noopener noreferrer" tabIndex={-1}>
              <Button size="lg" className="bg-white text-primary hover:bg-gray-50 shadow-lg px-8 h-14 text-lg">
                <DownloadCloud className="w-5 h-5 mr-2" />
                {brochure.cta}
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
