import { useState, useEffect } from 'react';

export const useLoadingDelay = (isLoading, minDelay = 1000) => {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    let timeoutId;
    
    if (isLoading) {
      timeoutId = setTimeout(() => {
        setShowLoading(true);
      }, 200); // Small delay before showing loading state to prevent flashing
    } else {
      timeoutId = setTimeout(() => {
        setShowLoading(false);
      }, minDelay); // Minimum loading time
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading, minDelay]);

  return showLoading;
};