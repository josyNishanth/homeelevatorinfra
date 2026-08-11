import { trustPoints } from '../data/content';
import { gsap, prefersReducedMotion, useGsap } from '../hooks/useScrollAnimation';
import { Container } from './ui/Section';

export default function TrustStrip() {
  const scope = useGsap<HTMLDivElement>((el) => {
    if (prefersReducedMotion()) return;
    gsap.from(el.querySelectorAll('[data-trust]'), {
      autoAlpha: 0,
      y: 20,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  return (
    <div className="bg-charcoal py-14 text-cream md:py-16">
      <Container>
        <div ref={scope} className="grid gap-y-9 sm:grid-cols-2 lg:grid-cols-5">
          {trustPoints.map((point, i) => (
            <div
              key={point.id}
              data-trust
              className="flex gap-4 lg:border-l lg:border-cream/12 lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
            >
              <span className="label-type pt-1 text-gold/70">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <p className="label-type text-cream">{point.label}</p>
                <p className="mt-2 max-w-[15rem] text-sm text-cream/50">{point.note}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
