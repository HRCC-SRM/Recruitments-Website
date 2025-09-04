import { useEffect, useRef } from 'react';

export function useThrottledEffect(
  effect: () => void,
  deps: React.DependencyList,
  delay: number = 1000
) {
  const lastRun = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastRun = now - lastRun.current;

    if (timeSinceLastRun >= delay) {
      // Run immediately if enough time has passed
      effect();
      lastRun.current = now;
    } else {
      // Schedule to run after the remaining delay
      const remainingDelay = delay - timeSinceLastRun;
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        effect();
        lastRun.current = Date.now();
      }, remainingDelay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, deps);
}
