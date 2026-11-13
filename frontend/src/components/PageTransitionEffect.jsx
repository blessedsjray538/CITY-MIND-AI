import React, { useEffect, useState } from 'react';

export default function PageTransitionEffect({ activeDepartment }) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setAnimating(true);
    const timer = setTimeout(() => {
      setAnimating(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [activeDepartment]);

  if (!animating) return null;

  return (
    <div className="perimeter-scan-beam" aria-hidden="true" />
  );
}
