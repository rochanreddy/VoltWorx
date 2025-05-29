import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const rotatingWords = ['Work', 'Skills', 'Impact'];

const HeroSection = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2200); // 2.2 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-[#2D004D] to-[#4B0082] overflow-hidden px-4">
      <div className="w-full max-w-3xl mx-auto text-center flex flex-col items-center justify-center py-24">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-8 font-display tracking-tight flex flex-wrap items-center justify-center h-20 md:h-24">
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
        <p className="text-lg md:text-xl text-white/80 mb-10 font-medium max-w-xl mx-auto">
          VoltWorx connects startups with top student talent — pay only for what impresses you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
      </div>
    </section>
  );
};

export default HeroSection; 