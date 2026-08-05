import { useState, useEffect } from 'react';

export const useCountdown = (initialSeconds) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft <= 0) {
      setIsActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  const start = () => setIsActive(true);
  const reset = (newSeconds) => {
    setSecondsLeft(newSeconds || initialSeconds);
    setIsActive(false);
  };

  return { secondsLeft, isActive, start, reset };
};
