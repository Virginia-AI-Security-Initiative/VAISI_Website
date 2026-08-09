'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

const easeOut = [0.2, 0, 0, 1] as const;

export const heroTransition = { duration: 0.48, ease: easeOut };
export const revealTransition = { duration: 0.6, ease: easeOut };

export const fadeSlideUp: Variants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: revealTransition },
};

export const fadeSlideLeft: Variants = {
  hidden: { opacity: 0, x: -24, filter: 'blur(4px)' },
  visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: revealTransition },
};

export const fadeSlideRight: Variants = {
  hidden: { opacity: 0, x: 24, filter: 'blur(4px)' },
  visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: revealTransition },
};

export function staggerContainer(stagger = 0.08, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  };
}

export const hoverLift = {
  whileHover: { y: -3, transition: { duration: 0.18, ease: easeOut } },
  whileTap: { scale: 0.97 },
};

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right';
  once?: boolean;
  amount?: number;
}

export function Reveal({ children, className, delay = 0, direction = 'up', once = true, amount = 0.15 }: RevealProps) {
  const reducedMotion = useReducedMotion();
  const variants = direction === 'left' ? fadeSlideLeft : direction === 'right' ? fadeSlideRight : fadeSlideUp;

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      transition={{ ...revealTransition, delay }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  once?: boolean;
  amount?: number;
}

export function StaggerGroup({ children, className, stagger = 0.08, delayChildren = 0, once = true, amount = 0.15 }: StaggerGroupProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={staggerContainer(stagger, delayChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
}

export function StaggerItem({ children, className, variants = fadeSlideUp }: StaggerItemProps) {
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
