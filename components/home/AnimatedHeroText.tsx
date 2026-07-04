'use client';

import { motion, Variants } from 'framer-motion';

export default function AnimatedHeroText() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        damping: 15,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <motion.h1 
        className="text-4xl sm:text-5xl lg:text-6xl font-black text-text-primary tracking-tight leading-none uppercase"
      >
        <motion.span variants={wordVariants} className="inline-block mr-3">
          AVENOIR
        </motion.span>
        <br />
        <motion.span 
          variants={wordVariants} 
          className="text-accent-primary inline-block"
        >
          ARAMID SHELLS
        </motion.span>
      </motion.h1>
      
      <motion.p 
        variants={wordVariants}
        className="text-sm sm:text-base text-text-secondary max-w-lg leading-relaxed pt-2"
      >
        High-performance protective structures milled from aerospace composites and double-tempered aluminosilicate. Tailored for pure device alignment, impact absorption, and minimalist EDC loadouts.
      </motion.p>
    </motion.div>
  );
}
