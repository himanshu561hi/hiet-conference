import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { contactData } from '../../data/contacts';
import { fadeUpVariant, staggerContainer } from '../../animations/sections';

export const ContactSection = () => {
  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Get in Touch
            </motion.h2>
            <motion.p variants={fadeUpVariant} className="text-lg text-gray-600 mb-10">
              Have questions about registration, paper submission, or tracks? Our team is here to help you.
            </motion.p>
            
            <div className="space-y-6">
              <motion.div variants={fadeUpVariant} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Email Us</h4>
                  <a href={`mailto:${contactData.conferenceEmail}`} className="text-gray-600 hover:text-primary transition-colors">
                    {contactData.conferenceEmail}
                  </a>
                </div>
              </motion.div>
              
              <motion.div variants={fadeUpVariant} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Call Us</h4>
                  <a href={`tel:${contactData.phone}`} className="text-gray-600 hover:text-primary transition-colors">
                    {contactData.phone}
                  </a>
                </div>
              </motion.div>

              <motion.div variants={fadeUpVariant} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Website</h4>
                  <a href={`https://${contactData.website}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition-colors">
                    {contactData.website}
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Coordinators Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {contactData.coordinators.map(coordinator => (
              <motion.div 
                key={coordinator.id}
                variants={fadeUpVariant}
                className="bg-surface border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <h4 className="text-lg font-bold text-gray-900 mb-1">{coordinator.name}</h4>
                <p className="text-sm font-medium text-primary mb-4">{coordinator.role}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Phone className="w-4 h-4" />
                  <span>{coordinator.phone}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
