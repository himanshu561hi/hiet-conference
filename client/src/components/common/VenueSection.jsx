import React from 'react';
import { motion } from 'framer-motion';
import { Navigation, MapPin } from 'lucide-react';
import { contactData } from '../../data/contacts';
import { MapPlaceholder } from './MapPlaceholder';
import { Button } from '../ui/Button';
import { fadeUpVariant, staggerContainer } from '../../animations/sections';

export const VenueSection = () => {
  return (
    <section className="py-24 bg-surface">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.span variants={fadeUpVariant} className="text-primary font-semibold tracking-wider uppercase mb-4 block text-sm">
            Event Location
          </motion.span>
          <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Conference Venue
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="text-lg text-gray-600">
            Join us physically at the HIET campus for an enriching offline conference experience.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div 
            className="lg:col-span-4 flex flex-col space-y-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUpVariant} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{contactData.venue.name}</h3>
              <p className="text-lg text-primary font-medium mb-4">{contactData.venue.city}</p>
              <p className="text-gray-600 leading-relaxed mb-8">{contactData.address}</p>
              
              <a href={contactData.venue.mapLink} target="_blank" rel="noopener noreferrer" tabIndex={-1}>
                <Button variant="outline" className="w-full group">
                  <Navigation className="w-4 h-4 mr-2 group-hover:text-primary" />
                  Get Directions
                </Button>
              </a>
            </motion.div>
          </motion.div>

          <motion.div 
            className="lg:col-span-8"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <MapPlaceholder />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
