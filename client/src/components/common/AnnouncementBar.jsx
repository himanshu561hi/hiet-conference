import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AnnouncementBar = ({ announcements }) => {
  const activeAnnouncement = announcements?.find(a => a.active);
  const [isVisible, setIsVisible] = useState(!!activeAnnouncement);

  if (!activeAnnouncement) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="bg-primary text-white overflow-hidden relative z-50"
        >
          <div className="container mx-auto px-4 py-2 md:py-2.5 flex items-center justify-center text-xs md:text-sm font-medium">
            <span className="flex-1 text-center flex items-center justify-center gap-2">
              {activeAnnouncement.text}
              {activeAnnouncement.link && (
                <Link 
                  to={activeAnnouncement.link}
                  className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-white/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded px-1"
                >
                  Learn More <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
              )}
            </span>
            <button
              onClick={() => setIsVisible(false)}
              className="absolute right-4 p-1 rounded-full hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Close announcement"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
