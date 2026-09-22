'use client';

import React from 'react';
import { motion, HTMLMotionProps, Variants } from 'motion/react';

export const fadeInSectionVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export const fadeInItemVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

interface FadeInSectionProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  animateImmediate?: boolean;
}

export function FadeInSection({
  children,
  className = '',
  animateImmediate = false,
  ...rest
}: FadeInSectionProps) {
  return (
    <motion.div
      initial="hidden"
      animate={animateImmediate ? 'show' : undefined}
      whileInView={!animateImmediate ? 'show' : undefined}
      viewport={!animateImmediate ? { once: true, amount: 0.2 } : undefined}
      variants={fadeInSectionVariants}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

interface FadeInItemProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
}

export function FadeInItem({ children, className = '', ...rest }: FadeInItemProps) {
  return (
    <motion.div variants={fadeInItemVariants} className={className} {...rest}>
      {children}
    </motion.div>
  );
}
