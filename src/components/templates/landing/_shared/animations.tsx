'use client';

import { m, useScroll, useTransform } from 'framer-motion';
import Image from '@/components/ui/Image';
import { MotionRoot } from '@/components/motion/MotionRoot';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { CSSProperties, ReactNode } from 'react';
import { useRef } from 'react';

type DivProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function FadeIn({
  children,
  className,
  style,
  delay = 0,
  y = 24,
}: DivProps & { delay?: number; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <MotionRoot>
      <m.div
        className={className}
        style={style}
        initial={reduce ? false : { opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 'some', margin: '120px 0px' }}
        transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </m.div>
    </MotionRoot>
  );
}

export function StaggerGroup({
  children,
  className,
  style,
  stagger = 0.08,
}: DivProps & { stagger?: number }) {
  const reduce = useReducedMotion();
  return (
    <MotionRoot>
      <m.div
        className={className}
        style={style}
        initial={reduce ? false : 'hidden'}
        whileInView="show"
        viewport={{ once: true, amount: 'some', margin: '120px 0px' }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: stagger } },
        }}
      >
        {children}
      </m.div>
    </MotionRoot>
  );
}

export function StaggerItem({
  children,
  className,
  style,
  y = 20,
}: DivProps & { y?: number }) {
  return (
    <MotionRoot>
      <m.div
        className={className}
        style={style}
        variants={{
          hidden: { opacity: 0, y },
          show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
        }}
      >
        {children}
      </m.div>
    </MotionRoot>
  );
}

/**
 * Parallax background image. Wrap any section with this and pass an image url.
 * The image scales/translates as you scroll, creating depth.
 */
export function ParallaxImage({
  src,
  alt = '',
  className = '',
  overlay,
  speed = 0.3,
  scale = 1.2,
  sizes = '100vw',
  children,
}: {
  src: string;
  alt?: string;
  className?: string;
  overlay?: ReactNode;
  speed?: number;
  scale?: number;
  /** Rendered width for the image optimiser; the default suits a full-width hero. */
  sizes?: string;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : [`-${speed * 50}%`, `${speed * 50}%`]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <MotionRoot>
        <m.div
          style={{ y, scale: reduce ? 1 : scale }}
          className="absolute inset-0 will-change-transform"
        >
          <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" loading="eager" fetchPriority="high" />
        </m.div>
      </MotionRoot>
      {overlay ? <div className="pointer-events-none absolute inset-0">{overlay}</div> : null}
      {children ? <div className="relative z-10">{children}</div> : null}
    </div>
  );
}

/**
 * Marquee — infinite horizontal scroll for slogans, dishes, awards.
 */
export function Marquee({
  children,
  className = '',
  speed = 30,
  reverse = false,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
  reverse?: boolean;
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <MotionRoot>
        <m.div
          className="flex w-max gap-12 whitespace-nowrap"
          animate={{ x: reverse ? [0, 0 - 1000] : [0 - 1000, 0] }}
          transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
        >
          {children}
          {children}
        </m.div>
      </MotionRoot>
    </div>
  );
}

/**
 * Hover-tilting card — adds depth via slight rotation on hover.
 */
export function TiltCard({
  children,
  className,
  style,
}: DivProps) {
  return (
    <MotionRoot>
      <m.div
        className={className}
        style={style}
        whileHover={{ y: -6, rotateX: 4, rotateY: -4, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {children}
      </m.div>
    </MotionRoot>
  );
}
