import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const rotatingWords = ['Work', 'Skills', 'Impact'];

const stats = [
  { label: 'Startups', value: '100+' },
  { label: 'Students', value: '500+' },
  { label: 'Projects', value: '200+' },
];

const HeroSection = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2200); // 2.2 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-32 overflow-hidden bg-transparent min-h-[90vh] flex items-center">
      {/* Background overlays and blobs for seamless blending, copied from HowItWorks */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-purple-900/10 to-gray-900/50" />
      <motion.div 
        className="absolute w-96 h-96 -top-48 -left-48 bg-purple-400/10 rounded-full blur-3xl pointer-events-none select-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute w-96 h-96 -bottom-48 -right-48 bg-blue-400/10 rounded-full blur-3xl pointer-events-none select-none"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.2, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none select-none" />
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 relative z-10">
        {/* Left: Main content */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          {/* Trusted by badge */}
          <div className="mb-6 flex justify-center md:justify-start">
            <span className="inline-block bg-white/10 text-purple-200 px-4 py-1 rounded-full text-xs font-semibold tracking-wider border border-white/10 shadow-sm backdrop-blur-md">
              Trusted by 100+ startups
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-8 font-display tracking-tight flex flex-wrap items-center justify-center md:justify-start h-20 md:h-24">
            <span className="mr-4">Real</span>
            <span className="relative inline-block w-[110px] md:w-[140px] h-[1em] align-middle">
              <AnimatePresence mode="wait">
                <motion.span
                  key={rotatingWords[index]}
                  initial={{ rotateX: 90, opacity: 0 }}
                  animate={{ rotateX: 0, opacity: 1 }}
                  exit={{ rotateX: -90, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-0 right-0 top-0 text-purple-300"
                  style={{ willChange: 'transform' }}
                >
                  {rotatingWords[index]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 font-medium max-w-xl">
            VoltWorx connects startups with top student talent — pay only for what impresses you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-8">
            <Link
              to="/register"
              className="px-8 py-4 rounded-lg font-bold text-white bg-gradient-to-r from-purple-600 to-purple-500 shadow-lg hover:from-purple-700 hover:to-purple-600 transition-colors text-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              I'm a Startup
            </Link>
            <Link
              to="/register"
              className="px-8 py-4 rounded-lg font-bold text-white border-2 border-white bg-transparent hover:bg-white/10 transition-colors text-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              I'm a Student
            </Link>
          </div>
          {/* Stats row */}
          <div className="flex gap-6 justify-center md:justify-start mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-bold text-purple-200 drop-shadow-lg">{stat.value}</span>
                <span className="text-xs text-purple-100/80 uppercase tracking-wider mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
          {/* Testimonial quote */}
          <div className="max-w-xs md:max-w-sm bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm text-purple-100 italic shadow-md backdrop-blur-md mx-auto md:mx-0">
            “VoltWorx helped me land my first real-world project and build my portfolio!”
            <span className="block mt-2 text-xs not-italic text-purple-300 font-semibold">— Mithresh, Student</span>
          </div>
        </div>
        {/* Right: SVG Illustration (desktop only) */}
        <div className="hidden md:flex w-1/2 justify-center items-center">
          {/* Abstract SVG illustration */}
          <svg width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="160" cy="160" r="120" fill="url(#paint0_radial)" fillOpacity="0.7" />
            <circle cx="100" cy="100" r="40" fill="#a78bfa" fillOpacity="0.25" />
            <circle cx="220" cy="80" r="30" fill="#f472b6" fillOpacity="0.18" />
            <circle cx="200" cy="220" r="50" fill="#818cf8" fillOpacity="0.18" />
            <defs>
              <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientTransform="translate(160 160) rotate(90) scale(120)" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a78bfa" />
                <stop offset="1" stopColor="#818cf8" stopOpacity="0.2" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
      {/* Animated scroll-down indicator */}
      <div className="absolute left-1/2 bottom-8 transform -translate-x-1/2 z-20">
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-8 h-8 flex items-center justify-center"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 8V24" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" />
            <path d="M10 18L16 24L22 18" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection; 