import React from 'react';

export const PageLoader = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
    <p className="mt-4 text-gray-500 font-medium">{message}</p>
  </div>
);

export const ButtonLoader = () => (
  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
);

export const FormLoader = () => (
  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
    <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
  </div>
);

export const UploadLoader = ({ progress }) => (
  <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
    <div 
      className="bg-primary h-4 transition-all duration-300 ease-out flex items-center justify-end pr-2" 
      style={{ width: `${progress}%` }}
    >
      {progress > 10 && <span className="text-[10px] font-bold text-white">{progress}%</span>}
    </div>
  </div>
);
