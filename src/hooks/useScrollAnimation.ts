import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

const REDUCED = '(prefers-reduced-motion: reduce)';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia(REDUCED).matches;

/**
 * Scoped GSAP setup. Everything created inside `setup` is reverted on cleanup,
 * so ScrollTriggers never leak across re-renders or StrictMode double-mounts.
 *
 * Animations must always start from the element's *final* visible state and be
 * set up with gsap.set/from inside `setup` — never hidden in CSS. If motion is
 * disabled or JS fails, the content is still there.
 */
export function useGsap<T extends HTMLElement = HTMLDivElement>(
  setup: (scope: T) => void,
  deps: unknown[] = [],
) {
  const scope = useRef<T>(null);

  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    const ctx = gsap.context(() => setup(el), el);
    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scope;
}

/** Matches a media query and keeps up with changes. */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/**
 * Tweens the text content of an element between numeric values.
 * The first value is written directly so nothing flashes on mount.
 */
export function useCountUp(value: number, format: (n: number) => string) {
  const ref = useRef<HTMLSpanElement>(null);
  const previous = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const from = previous.current;
    previous.current = value;

    if (from === null || prefersReducedMotion()) {
      el.textContent = format(value);
      return;
    }

    const state = { v: from };
    const tween = gsap.to(state, {
      v: value,
      duration: 0.7,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = format(state.v);
      },
    });
    return () => {
      tween.kill();
    };
  }, [value, format]);

  return ref;
}

/**
 * Recalculates trigger positions once layout settles. Web fonts reflow every
 * heading on this page, so waiting for document.fonts matters more than a timer.
 */
export function useScrollRefresh() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const id = window.setTimeout(refresh, 160);
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener('load', refresh);
    };
  }, []);
}
