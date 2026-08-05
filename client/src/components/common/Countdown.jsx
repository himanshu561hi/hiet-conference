import React, { useState, useEffect } from 'react';

export const Countdown = ({ targetDate, title }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const timeBlocks = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className="flex flex-col items-center mt-8">
      {title && <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">{title}</p>}
      <div className="flex space-x-4 md:space-x-8">
        {timeBlocks.map((block) => (
          <div key={block.label} className="flex flex-col items-center">
            <div className="bg-white/60 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-2">
              <span className="text-2xl md:text-3xl font-bold text-gray-900">
                {block.value.toString().padStart(2, '0')}
              </span>
            </div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">{block.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
