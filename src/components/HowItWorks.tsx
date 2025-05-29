import { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { Zap, Users, Award, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] // Custom easing for smoother animation
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="how-it-works" className="relative py-24 overflow-hidden">
      {/* Background gradient - adjusted to be lighter */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-purple-900/10 to-gray-900/50" />
      
      {/* Animated background elements - adjusted colors and opacity */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute w-96 h-96 -top-48 -left-48 bg-purple-400/10 rounded-full blur-3xl"
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
          className="absolute w-96 h-96 -bottom-48 -right-48 bg-blue-400/10 rounded-full blur-3xl"
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
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 mb-6">
            How VoltWorx Works
          </h2>
          <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto">
            A simple three-step process to connect talented students with innovative startups
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="relative"
        >
          {/* Vertical timeline line - adjusted color */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-purple-400/30 via-pink-400/30 to-purple-400/30" />

          {/* Step 1 */}
          <motion.div
            variants={itemVariants}
            className="relative mb-24 md:mb-32 flex flex-col md:flex-row items-center"
          >
            <div className="w-full md:w-1/2 md:pr-12 text-center md:text-right mb-8 md:mb-0">
              <motion.div 
                variants={iconVariants}
                className="bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-white/10 shadow-xl hover:border-purple-400/30 transition-all duration-300 group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-400/10 mb-6 group-hover:bg-purple-400/20 transition-all duration-300">
                  <Zap className="h-8 w-8 text-purple-300 group-hover:text-purple-200 transition-colors" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3 group-hover:text-purple-200 transition-colors">Post Your Task</h3>
                <p className="text-gray-200 text-lg">Startups post tasks like logos, landing pages, and more.</p>
                <div className="mt-4 flex justify-center md:justify-end">
                  <ArrowRight className="h-5 w-5 text-purple-300 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300" />
                </div>
              </motion.div>
            </div>
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-purple-400 border-4 border-gray-900/50" />
            <div className="w-full md:w-1/2 md:pl-12" />
          </motion.div>

          {/* Step 2 */}
          <motion.div
            variants={itemVariants}
            className="relative mb-24 md:mb-32 flex flex-col md:flex-row items-center"
          >
            <div className="w-full md:w-1/2 md:pr-12" />
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-purple-400 border-4 border-gray-900/50" />
            <div className="w-full md:w-1/2 md:pl-12 text-center md:text-left">
              <motion.div 
                variants={iconVariants}
                className="bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-white/10 shadow-xl hover:border-purple-400/30 transition-all duration-300 group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-400/10 mb-6 group-hover:bg-purple-400/20 transition-all duration-300">
                  <Users className="h-8 w-8 text-purple-300 group-hover:text-purple-200 transition-colors" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3 group-hover:text-purple-200 transition-colors">Students Submit Work</h3>
                <p className="text-gray-200 text-lg">Talented students submit their work for your review.</p>
                <div className="mt-4 flex justify-center md:justify-start">
                  <ArrowRight className="h-5 w-5 text-purple-300 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Step 3 (Horizontal) */}
          <motion.div
            variants={itemVariants}
            className="relative flex justify-center"
          >
            <div className="w-full max-w-2xl">
              <motion.div 
                variants={iconVariants}
                className="bg-white/5 backdrop-blur-xl p-8 md:p-10 rounded-2xl border border-white/10 shadow-xl hover:border-purple-400/30 transition-all duration-300 text-center group"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-400/10 mb-8 group-hover:bg-purple-400/20 transition-all duration-300">
                  <Award className="h-10 w-10 text-purple-300 group-hover:text-purple-200 transition-colors" />
                </div>
                <h3 className="text-3xl font-semibold text-white mb-4 group-hover:text-purple-200 transition-colors">Pick & Pay</h3>
                <p className="text-gray-200 text-lg md:text-xl">
                  Choose the work you love — we'll securely transfer the reward to the selected student after confirmation.
                </p>
                <div className="mt-6 flex justify-center">
                  <ArrowRight className="h-6 w-6 text-purple-300 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks; 