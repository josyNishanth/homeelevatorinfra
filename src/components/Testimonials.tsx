import { useState } from 'react';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { testimonials } from '../data/content';
import { gsap, prefersReducedMotion, useGsap } from '../hooks/useScrollAnimation';
import MaskedHeading from './ui/MaskedHeading';
import Reveal from './ui/Reveal';
import Section, { Container, Eyebrow } from './ui/Section';

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const active = testimonials[index];
  const unverified = testimonials.some((t) => !t.verified);

  const scope = useGsap<HTMLDivElement>(
    (el) => {
      if (prefersReducedMotion()) return;
      gsap.from(el.querySelectorAll('[data-quote]'), {
        autoAlpha: 0,
        y: 18,
        duration: 0.6,
        stagger: 0.06,
        ease: 'power2.out',
      });
    },
    [index],
  );

  const go = (delta: number) => setIndex((i) => (i + delta + testimonials.length) % testimonials.length);

  return (
    <Section tone="charcoal" pad="lg">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <Eyebrow className="text-cream/50">Owners</Eyebrow>
            </Reveal>
            <MaskedHeading as="h2" text="In their words" className="mt-7 text-title text-cream" />
            {unverified && (
              <p className="label-type mt-8 max-w-xs border border-gold/40 px-4 py-3 text-gold/80">
                Placeholder content — awaiting verified customer testimonials
              </p>
            )}
          </div>

          <div ref={scope} className="lg:col-span-7 lg:col-start-6">
            <Quote size={30} strokeWidth={1.2} className="text-gold/50" aria-hidden="true" />

            <blockquote data-quote className="mt-6">
              <p className="display-type text-2xl leading-tight text-cream/90 md:text-3xl lg:text-[2.4rem]">
                {active.quote}
              </p>
            </blockquote>

            <div data-quote className="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <span className="display-type text-lg text-cream">{active.author}</span>
              <span className="label-type text-cream/45">{active.role}</span>
              <span className="label-type text-gold/70">{active.project}</span>
            </div>

            <div className="mt-12 flex items-center justify-between gap-6 border-t border-cream/12 pt-6">
              <div className="flex items-center gap-2">
                {testimonials.map((t, i) => (
                  <button
                    key={t.id}
                    type="button"
                    aria-current={i === index}
                    aria-label={`Show testimonial ${i + 1} of ${testimonials.length}`}
                    onClick={() => setIndex(i)}
                    className={`h-px transition-all duration-500 ease-brand ${
                      i === index ? 'w-12 bg-gold' : 'w-6 bg-cream/25 hover:bg-cream/50'
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous testimonial"
                  className="flex h-11 w-11 items-center justify-center border border-cream/20 text-cream/70 transition-colors duration-300 hover:border-cream hover:text-cream"
                >
                  <ArrowLeft size={16} strokeWidth={1.6} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next testimonial"
                  className="flex h-11 w-11 items-center justify-center border border-cream/20 text-cream/70 transition-colors duration-300 hover:border-cream hover:text-cream"
                >
                  <ArrowRight size={16} strokeWidth={1.6} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
