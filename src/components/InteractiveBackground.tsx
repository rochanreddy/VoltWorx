import { useEffect, useRef } from 'react';

const InteractiveBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = container.getBoundingClientRect();
      
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;
      
      const elements = container.querySelectorAll('.floating-element');
      elements.forEach((element) => {
        const el = element as HTMLElement;
        const speed = parseFloat(el.dataset.speed || '1');
        const offsetX = (x - 0.5) * speed * 100;
        const offsetY = (y - 0.5) * speed * 100;
        
        // Enhanced movement with depth effect
        const scale = 1 + Math.abs(x - 0.5) * 0.2;
        const rotate = offsetX * 0.2;
        const translateZ = Math.abs(x - 0.5) * 50;
        
        el.style.transform = `translate3d(${offsetX}px, ${offsetY}px, ${translateZ}px) rotate(${rotate}deg) scale(${scale})`;
        
        // Add subtle color shift based on mouse position
        const hue = (x * 360 + y * 180) % 360;
        el.style.filter = `blur(3rem) hue-rotate(${hue}deg)`;
      });
    };

    // Add smooth transitions
    const elements = container.querySelectorAll('.floating-element');
    elements.forEach((element) => {
      const el = element as HTMLElement;
      el.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), filter 0.5s ease-out';
    });

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
    >
      {/* Main background elements */}
      <div 
        className="floating-element absolute w-96 h-96 rounded-full bg-purple-500/20 blur-3xl"
        style={{ top: '20%', left: '10%' }}
        data-speed="1.5"
      />
      <div 
        className="floating-element absolute w-80 h-80 rounded-full bg-blue-500/20 blur-3xl"
        style={{ top: '60%', left: '70%' }}
        data-speed="1.2"
      />
      <div 
        className="floating-element absolute w-72 h-72 rounded-full bg-pink-500/20 blur-3xl"
        style={{ top: '30%', left: '50%' }}
        data-speed="2"
      />
      
      {/* Accent elements */}
      <div 
        className="floating-element absolute w-56 h-56 rounded-full bg-violet-500/15 blur-2xl"
        style={{ top: '40%', left: '80%' }}
        data-speed="1.3"
      />
      <div 
        className="floating-element absolute w-48 h-48 rounded-full bg-fuchsia-500/15 blur-2xl"
        style={{ top: '10%', left: '30%' }}
        data-speed="1.7"
      />
      
      {/* Subtle background elements */}
      <div 
        className="floating-element absolute w-40 h-40 rounded-full bg-indigo-500/10 blur-xl"
        style={{ top: '70%', left: '20%' }}
        data-speed="1.8"
      />
      <div 
        className="floating-element absolute w-32 h-32 rounded-full bg-cyan-500/10 blur-xl"
        style={{ top: '50%', left: '40%' }}
        data-speed="1.4"
      />
    </div>
  );
};

export default InteractiveBackground; 