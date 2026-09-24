import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertTriangle } from 'lucide-react';

export const CountdownTimer = ({ endTime, onExpire, size = 'md', className = '' }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, expired: false });

  useEffect(() => {
    if (!endTime) return;

    const calculateTime = () => {
      const target = new Date(endTime).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, expired: true });
        if (onExpire) onExpire();
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({ hours, minutes, seconds, totalSeconds, expired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [endTime, onExpire]);

  const isUrgent = !timeLeft.expired && timeLeft.totalSeconds < 60;

  if (timeLeft.expired) {
    return (
      <span className={`inline-flex items-center gap-1 font-mono font-bold text-red-400 bg-red-500/10 border border-red-500/30 rounded-full px-3 py-1 ${className}`}>
        <AlertTriangle className="w-3.5 h-3.5" /> ENDED
      </span>
    );
  }

  const formatNumber = (num) => String(num).padStart(2, '0');

  return (
    <div
      className={`inline-flex items-center gap-1.5 font-mono font-bold transition-all rounded-full ${
        isUrgent
          ? 'bg-red-500/15 text-red-400 border border-red-500/40 animate-pulse px-3 py-1 shadow-sm'
          : 'bg-dark-surface text-amber-300 border border-dark-border px-3 py-1'
      } ${size === 'lg' ? 'text-lg px-4 py-1.5' : 'text-xs'} ${className}`}
    >
      <Clock className={`shrink-0 ${size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5'} ${isUrgent ? 'text-red-400' : 'text-amber-400'}`} />

      <div className="flex items-center">
        {timeLeft.hours > 0 && (
          <>
            <AnimatePresence mode="wait">
              <motion.span
                key={timeLeft.hours}
                initial={{ y: -5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 5, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {formatNumber(timeLeft.hours)}
              </motion.span>
            </AnimatePresence>
            <span className="mx-0.5 opacity-60">:</span>
          </>
        )}

        <AnimatePresence mode="wait">
          <motion.span
            key={timeLeft.minutes}
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 5, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {formatNumber(timeLeft.minutes)}
          </motion.span>
        </AnimatePresence>
        <span className="mx-0.5 opacity-60">:</span>

        <AnimatePresence mode="wait">
          <motion.span
            key={timeLeft.seconds}
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 5, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {formatNumber(timeLeft.seconds)}
          </motion.span>
        </AnimatePresence>
      </div>

      {isUrgent && <span className="text-[10px] uppercase font-sans tracking-wide ml-1 text-red-300">Urgent</span>}
    </div>
  );
};
