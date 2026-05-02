'use client';

import { useEffect } from 'react';

export default function ScrollTracker() {
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleScroll = () => {
      document.body.classList.add('is-scrolling');
      
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        document.body.classList.remove('is-scrolling');
      }, 1000); // Hide after 1 second of no scrolling
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  return null;
}
