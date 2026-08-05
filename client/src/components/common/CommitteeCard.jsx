import React from 'react';
import { motion } from 'framer-motion';
import { UserCircle2 } from 'lucide-react';
import { cardEntryVariant } from '../../animations/cards';

export const CommitteeCard = ({ member }) => {
  return (
    <motion.div 
      variants={cardEntryVariant}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col items-center text-center"
    >
      <div className="w-24 h-24 rounded-full bg-surface border-4 border-white shadow-inner mb-5 overflow-hidden flex items-center justify-center text-gray-300 group-hover:scale-105 transition-transform duration-300">
        <UserCircle2 className="w-12 h-12 opacity-50" />
      </div>
      <h4 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h4>
      <p className="text-primary font-medium text-sm mb-2">{member.designation}</p>
      <div className="w-8 h-0.5 bg-gray-200 mb-3 rounded-full" />
      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{member.department}</p>
      <p className="text-gray-400 text-xs">{member.organization}</p>
    </motion.div>
  );
};
