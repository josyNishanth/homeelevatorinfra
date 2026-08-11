import { useEffect, useRef } from 'react';
import { processSteps } from '../data/content';
import { gsap } from '../hooks/useScrollAnimation';
import MaskedHeading from './ui/MaskedHeading';
import Reveal from './ui/Reveal';
import { Container, Eyebrow } from './ui/Section';

/**
 * Desktop: the section pins and the six steps travel sideways — the sequence is
 * literal, so horizontal motion carries meaning rather than decoration.
 * Mobile and reduced-motion: the same markup reads as a vertical timeline.
 */
export default function HowItWorks() {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    const track = el.querySelector<HTMLElement>('[data-track]');
    const progress = el.querySelector<HTMLElement>('[data-progress]');
    if (!track) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const distance = () => Math.max(0, track.scrollWidth - el.clientWidth + 96);

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: () => `+=${distance() + window.innerHeight * 0.3}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progress) gsap.set(progress, { scaleX: self.progress });
          },
        },
      });

      return () => {
        tween.kill();
      };
    });

    return () => {
      mm.kill();
    };
  }, []);

  return (
    <div ref={scope} className="relative overflow-hidden bg-charcoal py-20 text-cream lg:h-screen lg:py-0">
      <div className="flex h-full flex-col justify-center">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-8 lg:pt-16">
            <div>
              <Reveal>
                <Eyebrow className="text-cream/50">Process</Eyebrow>
              </Reveal>
              <MaskedHeading as="h2" text="From first call to first ride" className="mt-6 text-title text-cream" />
            </div>
            <p className="label-type max-w-xs text-cream/45">Six steps · one team from design to handover</p>
          </div>

          <div aria-hidden="true" className="mt-10 h-px w-full bg-cream/12">
            <span data-progress className="block h-px origin-left scale-x-0 bg-gold" />
          </div>
        </Container>

        <ol
          data-track
          className="mt-10 flex flex-col gap-6 px-6 md:px-10 lg:mt-14 lg:flex-row lg:gap-0 lg:px-16 lg:will-change-transform"
        >
          {processSteps.map((step) => (
            <li
              key={step.index}
              className="relative flex gap-6 border-t border-cream/12 pt-6 lg:h-[19rem] lg:w-[22rem] lg:shrink-0 lg:flex-col lg:justify-between lg:gap-0 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8 xl:w-[24rem]"
            >
              <span className="display-type shrink-0 text-4xl text-gold/40 lg:text-7xl">{step.index}</span>
              <div className="lg:pr-10">
                <h3 className="display-type text-xl text-cream lg:text-2xl">{step.title}</h3>
                <p className="mt-3 max-w-sm text-sm text-cream/60">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
