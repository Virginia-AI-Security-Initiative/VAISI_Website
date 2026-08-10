'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { fadeSlideUp, fadeSlideRight, heroTransition } from '@/components/motion';

interface PageHeroProps {
  title: ReactNode;
  subtitle?: ReactNode;
  align?: 'left' | 'center';
  aside?: ReactNode;
  size?: 'default' | 'compact';
  titleClassName?: string;
  className?: string;
}

function CornerAccents() {
  return (
    <>
      <div className="pointer-events-none absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-white/25" />
      <div className="pointer-events-none absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-white/25" />
    </>
  );
}

export default function PageHero({
  title,
  subtitle,
  align = 'center',
  aside,
  size = 'default',
  titleClassName = 'text-5xl md:text-6xl lg:text-7xl',
  className = '',
}: PageHeroProps) {
  const paddingY = size === 'compact' ? 'py-14 md:py-16' : 'py-20 md:py-24';

  return (
    <section className={`relative overflow-hidden bg-[#232D4B] ${className}`}>
      <div className="diamond-pattern pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#232D4B]/40 via-transparent to-[#0c0c0c]/60" />
      <CornerAccents />
      <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${paddingY}`}>
        {align === 'left' && aside ? (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
            <div className="max-w-3xl">
              <motion.h1
                initial="hidden"
                animate="visible"
                variants={fadeSlideUp}
                transition={heroTransition}
                className={`${titleClassName} font-bold leading-tight text-white`}
              >
                {title}
              </motion.h1>
              {subtitle && (
                <motion.p
                  initial="hidden"
                  animate="visible"
                  variants={fadeSlideUp}
                  transition={{ ...heroTransition, delay: 0.08 }}
                  className="mt-4 text-xl md:text-2xl text-white/75"
                >
                  {subtitle}
                </motion.p>
              )}
            </div>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeSlideRight}
              transition={{ ...heroTransition, delay: 0.08 }}
            >
              {aside}
            </motion.div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeSlideUp}
              transition={heroTransition}
              className={`${titleClassName} font-bold text-white`}
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p
                initial="hidden"
                animate="visible"
                variants={fadeSlideUp}
                transition={{ ...heroTransition, delay: 0.08 }}
                className="mt-4 text-xl md:text-2xl text-white/75"
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
