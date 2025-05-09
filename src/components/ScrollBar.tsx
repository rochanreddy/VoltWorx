import { useEffect, useState } from 'react';

const ScrollBar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed right-0 top-0 h-full w-2 z-50">
      <div 
        className="absolute right-0 top-0 w-full bg-purple-500/30 transition-all duration-300"
        style={{ 
          height: `${scrollProgress}%`,
          background: `linear-gradient(to bottom, rgba(139, 92, 246, 0.3), rgba(139, 92, 246, 0.5))`
        }}
      />
    </div>
  );
};

export default ScrollBar; 