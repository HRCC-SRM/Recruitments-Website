import { useEffect, useRef } from 'react';

export function useStableEffect(
  effect: () => void | (() => void),
  deps: React.DependencyList,
  options: {
    skipFirst?: boolean;
    throttleMs?: number;
  } = {}
) {
  const { skipFirst = false, throttleMs = 0 } = options;
  const hasRun = useRef(false);
  const lastRun = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Skip first run if requested
    if (skipFirst && !hasRun.current) {
      hasRun.current = true;
      return;
    }

    // Throttle if specified
    if (throttleMs > 0) {
      const now = Date.now();
      const timeSinceLastRun = now - lastRun.current;

      if (timeSinceLastRun < throttleMs) {
        // Clear existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Schedule for later
        timeoutRef.current = setTimeout(() => {
          effect();
          lastRun.current = Date.now();
        }, throttleMs - timeSinceLastRun);
        
        return () => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        };
      }
    }

    // Run immediately
    effect();
    lastRun.current = Date.now();
    hasRun.current = true;
  }, deps);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
}
