import { gsap, prefersReducedMotion, useGsap } from '../../hooks/useScrollAnimation';

type Props = {
  value: number;
  /** Rendered after the number, e.g. "+". */
  suffix?: string;
  className?: string;
  duration?: number;
};

/** Counts from zero to `value` the first time it scrolls into view. */
export default function CountUp({ value, suffix = '', className = '', duration = 1.4 }: Props) {
  const scope = useGsap<HTMLSpanElement>(
    (el) => {
      const target = el.querySelector<HTMLElement>('[data-count]');
      if (!target || prefersReducedMotion()) return;

      const state = { n: 0 };
      gsap.to(state, {
        n: value,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
          target.textContent = String(Math.round(state.n));
        },
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    },
    [value, duration],
  );

  return (
    <span ref={scope} className={className}>
      <span data-count>{value}</span>
      {suffix}
    </span>
  );
}
