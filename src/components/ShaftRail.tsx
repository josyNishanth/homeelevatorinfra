import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { railStops } from '../data/content';
import { ScrollTrigger, gsap, prefersReducedMotion } from '../hooks/useScrollAnimation';

/**
 * The signature element: a hairline shaft down the right edge of the page with a
 * gold cab that travels as you scroll, passing each section like a floor stop.
 * It is the page's progress indicator, drawn in the product's own language.
 *
 * Large screens only — decorative, and hidden from assistive technology since
 * the same navigation exists in the header.
 */
export default function ShaftRail() {
  const rail = useRef<HTMLDivElement>(null);
  const cab = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { pathname } = useLocation();

  useEffect(() => {
    const track = rail.current;
    const car = cab.current;
    if (!track || !car) return;

    const reduced = prefersReducedMotion();
    const travel = () => track.clientHeight - car.clientHeight;

    const setY = reduced
      ? (v: number) => gsap.set(car, { y: v })
      : gsap.quickTo(car, 'y', { duration: 0.45, ease: 'power2.out' });

    // Recreated per route: each page has a different scrollable height, and a
    // trigger built against the previous page's height reads the wrong progress.
    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        setY(self.progress * travel());
        setActive(Math.min(railStops.length - 1, Math.round(self.progress * (railStops.length - 1))));
      },
    });

    return () => {
      st.kill();
    };
  }, [pathname]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 right-6 z-30 hidden h-screen w-px items-center xl:flex"
    >
      {/* A mid grey stays legible over both the cream and navy sections. */}
      <div ref={rail} className="relative h-[62vh] w-px bg-[#8b8d92]/45">
        {railStops.map((stop, i) => (
          <span
            key={stop.id}
            className={`absolute right-0 block h-px transition-all duration-500 ease-brand ${
              i === active ? 'w-4 bg-gold' : 'w-2 bg-[#8b8d92]/60'
            }`}
            style={{ top: `${(i / (railStops.length - 1)) * 100}%` }}
          />
        ))}

        <div ref={cab} className="absolute -right-[3px] top-0 h-9 w-[7px] bg-gold" />
      </div>
    </div>
  );
}
