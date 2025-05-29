import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const rotatingWords = ['Work', 'Skills', 'Impact'];

const features = [
  { emoji: '🚀', text: 'Real micro-projects, real outcomes' },
  { emoji: '🎯', text: 'Limit student slots for focus' },
  { emoji: '🏆', text: 'Top work gets recognized + rewarded' },
  { emoji: '💡', text: 'Every student gains experience' },
  { emoji: '🤝', text: 'No hiring – pure collaboration' },
];

const HeroSection = () => {
  const [index, setIndex] = useState(0);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2200); // 2.2 seconds
    return () => clearInterval(interval);
  }, []);

  const handleExploreClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.role === 'startup') {
      navigate('/startup/dashboard');
    } else if (user?.role === 'student') {
      navigate('/student/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="relative py-24 overflow-hidden bg-transparent">
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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">
          {/* Left: Animated headline, subtext, buttons */}
          <div className="flex-1 w-full max-w-3xl text-center lg:text-left flex flex-col items-center lg:items-start justify-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-8 font-display tracking-tight flex flex-wrap items-center justify-center lg:justify-start h-20 md:h-24">
              <span className="mr-2 sm:mr-4">Real</span>
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
            <p className="text-lg md:text-xl text-white/80 mb-10 font-medium max-w-xl mx-auto lg:mx-0">
              VoltWorx connects startups with top student talent — pay only for what impresses you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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
          {/* Right: Why VoltWorx Stands Out Card */}
          <div className="flex-1 w-full max-w-md">
            <div className="bg-gradient-to-br from-gray-900/80 via-purple-900/60 to-violet-900/80 rounded-2xl shadow-2xl border border-white/10 p-8 flex flex-col items-center gap-6 backdrop-blur-xl">
              <h3 className="text-xl font-bold text-white mb-2 text-center">Why VoltWorx Stands Out</h3>
              <ul className="space-y-3 w-full">
                {features.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/90 text-base md:text-lg">
                    <span className="text-xl md:text-2xl leading-none">{item.emoji}</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleExploreClick}
                className="mt-4 w-full inline-block text-center px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 transition-colors text-base focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                Explore How It Works
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 