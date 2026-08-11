import type { ElementType, ReactNode } from 'react';
import { gsap, prefersReducedMotion, useGsap } from '../../hooks/useScrollAnimation';

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Vertical travel in px. */
  y?: number;
  delay?: number;
  duration?: number;
  /** When set, direct children animate in sequence instead of the wrapper. */
  stagger?: number;
  scale?: number;
  start?: string;
};

/**
 * Scroll-triggered entrance. The element's resting state is its normal state —
 * GSAP sets the "before" state at runtime, so with motion disabled (or no JS)
 * everything renders visible.
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  className = '',
  y = 26,
  delay = 0,
  duration = 0.9,
  stagger,
  scale,
  start = 'top 84%',
}: RevealProps) {
  const scope = useGsap<HTMLElement>(
    (el) => {
      if (prefersReducedMotion()) return;
      const targets = stagger ? Array.from(el.children) : el;
      if (stagger && (targets as Element[]).length === 0) return;

      gsap.from(targets, {
        autoAlpha: 0,
        y,
        scale: scale ?? 1,
        duration,
        delay,
        stagger: stagger ?? 0,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start, once: true },
      });
    },
    [y, delay, duration, stagger, scale, start],
  );

  return (
    <Tag ref={scope} className={className}>
      {children}
    </Tag>
  );
}
