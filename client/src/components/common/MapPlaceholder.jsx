import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

export const MapPlaceholder = () => {
  return (
    <div className="w-full h-[400px] md:h-[500px] bg-gray-100 rounded-3xl border border-gray-200 overflow-hidden relative group">
      {/* Abstract Map Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="map-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M60 0L0 60M0 0l60 60" fill="none" stroke="currentColor" strokeWidth="1" />
              <rect width="60" height="60" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#map-grid)" />
        </svg>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary shadow-lg mb-4 group-hover:-translate-y-2 transition-transform duration-300">
          <MapPin className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">[ Google Maps Integration ]</h3>
        <p className="text-gray-500 max-w-sm">Architecture ready. API integration will replace this component in later phases.</p>
      </div>
    </div>
  );
};
