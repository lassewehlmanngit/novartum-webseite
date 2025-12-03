import { useEffect } from 'react';
import { trackMicroConversion } from '../utils/analytics';

/**
 * Tracks time on page as a micro-conversion
 * Fires events at 30s, 2min, and 5min milestones
 */
export const useTimeOnPageTracking = () => {
  useEffect(() => {
    const milestones = [30, 120, 300]; // 30s, 2min, 5min
    const timers: NodeJS.Timeout[] = [];

    milestones.forEach((seconds) => {
      const timer = setTimeout(() => {
        trackMicroConversion('time_on_page', `${seconds}s`);
      }, seconds * 1000);
      timers.push(timer);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);
};

