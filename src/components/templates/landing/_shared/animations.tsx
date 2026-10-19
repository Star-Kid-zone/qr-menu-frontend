'use client';

import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import Image from 'next/image';
import type { CSSProperties, ReactNode } from 'react';
import { useRef, useState, useEffect } from 'react';

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
    <motion.div
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 'some', margin: '120px 0px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
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
    <motion.div
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
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  style,
  y = 20,
}: DivProps & { y?: number }) {
  return (
    <motion.div
      className={className}
      style={style}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
      }}
    >
      {children}
    </motion.div>
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
  children,
}: {
  src: string;
  alt?: string;
  className?: string;
  overlay?: ReactNode;
  speed?: number;
  scale?: number;
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
      <motion.div
        style={{ y, scale: reduce ? 1 : scale }}
        className="absolute inset-0 will-change-transform"
      >
        <Image src={src} alt={alt} fill className="object-cover" priority />
      </motion.div>
      {overlay ? <div className="pointer-events-none absolute inset-0">{overlay}</div> : null}
      {children ? <div className="relative z-10">{children}</div> : null}
    </div>
  );
}

/**
 * Vertical parallax for any element (text, image, card).
 */
export function ParallaxLayer({
  children,
  className,
  style,
  speed = 0.2,
}: DivProps & { speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [80 * speed, -80 * speed]);
  return (
    <motion.div ref={ref} style={{ ...style, y }} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * Soft floating blob background ornament — purely decorative.
 */
export function FloatingBlob({
  className = '',
  delay = 0,
  duration = 10,
  style,
}: {
  className?: string;
  delay?: number;
  duration?: number;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className} style={style} aria-hidden />;
  return (
    <motion.div
      aria-hidden
      className={className}
      style={style}
      animate={{
        y: [0, -28, 0],
        x: [0, 18, 0],
        rotate: [0, 6, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
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
      <motion.div
        className="flex w-max gap-12 whitespace-nowrap"
        animate={{ x: reverse ? [0, 0 - 1000] : [0 - 1000, 0] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      >
        {children}
        {children}
      </motion.div>
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
    <motion.div
      className={className}
      style={style}
      whileHover={{ y: -6, rotateX: 4, rotateY: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Counter that animates from 0 to value when scrolled into view.
 */
export function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <span>{value}{suffix}</span>;
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {value}{suffix}
    </motion.span>
  );
}

/**
 * Reveals text character by character on scroll.
 */
export function SplitText({
  text,
  className,
  style,
  delay = 0,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={className} style={style}>{text}</span>;
  const chars = text.split('');
  return (
    <motion.span
      className={`inline-block ${className ?? ''}`}
      style={style}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.025, delayChildren: delay } },
      }}
    >
      {chars.map((c, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: '0.4em' },
            show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
          }}
        >
          {c === ' ' ? '\u00A0' : c}
        </motion.span>
      ))}
    </motion.span>
  );
}

/**
 * Magnetic hover effect — element follows cursor slightly on hover.
 */
export function MagneticButton({
  children,
  className,
  style,
  strength = 0.3,
}: DivProps & { strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });
  const reduce = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...style, x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}

/**
 * Reveal text with a sliding mask — cinematic text reveal.
 */
export function RevealText({
  children,
  className,
  style,
  delay = 0,
  direction = 'up',
}: DivProps & { delay?: number; direction?: 'up' | 'down' | 'left' | 'right' }) {
  const reduce = useReducedMotion();
  const variants = {
    up:    { hidden: { y: '110%' }, show: { y: 0 } },
    down:  { hidden: { y: '-110%' }, show: { y: 0 } },
    left:  { hidden: { x: '110%' }, show: { x: 0 } },
    right: { hidden: { x: '-110%' }, show: { x: 0 } },
  };
  return (
    <div className={`overflow-hidden ${className ?? ''}`} style={style}>
      <motion.div
        initial={reduce ? false : variants[direction].hidden}
        whileInView={variants[direction].show}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Scale-in reveal — pops in from small scale.
 */
export function ScaleIn({
  children,
  className,
  style,
  delay = 0,
  from = 0.85,
}: DivProps & { delay?: number; from?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, scale: from }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Glitch text effect — for cyberpunk / glitch themes.
 */
export function GlitchText({
  text,
  className,
  style,
  color1 = '#ff0040',
  color2 = '#00ffff',
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
  color1?: string;
  color2?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={className} style={style}>{text}</span>;
  return (
    <span className={`relative inline-block ${className ?? ''}`} style={style}>
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ color: color1, clipPath: 'polygon(0 30%, 100% 30%, 100% 50%, 0 50%)' }}
        animate={{ x: [0, -3, 3, 0], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 3, ease: 'linear' }}
      >
        {text}
      </motion.span>
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ color: color2, clipPath: 'polygon(0 60%, 100% 60%, 100% 80%, 0 80%)' }}
        animate={{ x: [0, 3, -3, 0], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 3.1, ease: 'linear' }}
      >
        {text}
      </motion.span>
      {text}
    </span>
  );
}

/**
 * Typewriter effect — types text character by character.
 */
export function Typewriter({
  text,
  className,
  style,
  speed = 50,
  delay = 0,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
  speed?: number;
  delay?: number;
}) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) { setDisplayed(text); return; }
    const timer = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay, reduce, text]);

  useEffect(() => {
    if (!started || reduce) return;
    if (displayed.length >= text.length) return;
    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [started, displayed, text, speed, reduce]);

  return (
    <span className={className} style={style}>
      {displayed}
      {displayed.length < text.length && started && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-0.5 bg-current"
        >
          |
        </motion.span>
      )}
    </span>
  );
}

/**
 * Scroll-triggered number counter.
 */
export function AnimatedNumber({
  value,
  suffix = '',
  prefix = '',
  duration = 1.5,
  className,
  style,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const [count, setCount] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || reduce) { setCount(value); return; }
    const start = Date.now();
    const end = start + duration * 1000;
    const tick = () => {
      const now = Date.now();
      const progress = Math.min((now - start) / (end - start), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value, duration, reduce]);

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}{count}{suffix}
    </span>
  );
}

/**
 * Horizontal scroll gallery — drag to scroll.
 */
export function DragScroll({
  children,
  className,
  style,
}: DivProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const reduce = useReducedMotion();

  return (
    <div className={`overflow-hidden cursor-grab active:cursor-grabbing ${className ?? ''}`} style={style}>
      <motion.div
        ref={ref}
        className="flex gap-4 w-max"
        drag={reduce ? false : 'x'}
        dragConstraints={{ left: -2000, right: 0 }}
        style={{ x }}
        whileTap={{ cursor: 'grabbing' }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Spotlight hover effect — radial gradient follows cursor.
 */
export function SpotlightCard({
  children,
  className,
  style,
  spotlightColor = 'rgba(255,255,255,0.08)',
}: DivProps & { spotlightColor?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className ?? ''}`}
      style={{
        ...style,
        background: isHovered
          ? `radial-gradient(300px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 70%)`
          : undefined,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
}

/**
 * Stagger fade-in for list items with custom delay multiplier.
 */
export function StaggerFade({
  children,
  className,
  style,
  delayMultiplier = 0.1,
  baseDelay = 0,
}: DivProps & { delayMultiplier?: number; baseDelay?: number }) {
  const reduce = useReducedMotion();
  const items = Array.isArray(children) ? children : [children];
  return (
    <div className={className} style={style}>
      {items.map((child, i) => (
        <motion.div
          key={i}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: baseDelay + i * delayMultiplier, ease: [0.16, 1, 0.3, 1] }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Rotating border gradient card.
 */
export function GradientBorderCard({
  children,
  className,
  style,
  gradient = 'linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3)',
  borderWidth = 2,
}: DivProps & { gradient?: string; borderWidth?: number }) {
  const reduce = useReducedMotion();
  return (
    <div className={`relative ${className ?? ''}`} style={style}>
      <motion.div
        className="absolute inset-0 rounded-[inherit]"
        style={{ background: gradient, padding: borderWidth }}
        animate={reduce ? {} : { rotate: [0, 360] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
      <div className="relative rounded-[inherit] bg-inherit">
        {children}
      </div>
    </div>
  );
}

/**
 * Noise texture overlay — adds grain/texture to sections.
 */
export function NoiseOverlay({
  opacity = 0.04,
  className = '',
}: {
  opacity?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '128px 128px',
      }}
    />
  );
}
