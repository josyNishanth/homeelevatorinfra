import { architectureScenes } from '../data/content';
import { gsap, prefersReducedMotion, useGsap } from '../hooks/useScrollAnimation';
import MaskedHeading from './ui/MaskedHeading';
import Reveal from './ui/Reveal';
import Section, { Container, Eyebrow } from './ui/Section';

export default function ArchitectureShowcase() {
  const scope = useGsap<HTMLDivElement>((el) => {
    if (prefersReducedMotion()) return;
    el.querySelectorAll<HTMLElement>('[data-scene]').forEach((scene, i) => {
      const img = scene.querySelector('img');
      if (!img) return;
      gsap.fromTo(
        img,
        { yPercent: -6 },
        {
          yPercent: 6 + (i % 3) * 2,
          ease: 'none',
          scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    });
  });

  return (
    <Section tone="navy" pad="lg">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Reveal>
              <Eyebrow className="text-cream/50">Integration</Eyebrow>
            </Reveal>
            <MaskedHeading
              as="h2"
              text={'Designed for the home\nyou already have'}
              className="mt-7 text-display text-cream"
            />
          </div>
          <Reveal y={18} delay={0.1} className="lg:col-span-3 lg:col-start-10 lg:self-end">
            <p className="text-cream/60">
              A lift does not need a new house. It needs the right corner of the one you live in.
            </p>
          </Reveal>
        </div>

        <div ref={scope} className="mt-14 grid gap-6 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-8">
          {architectureScenes.map((scene, i) => (
            <Reveal
              key={scene.id}
              y={30}
              delay={(i % 3) * 0.07}
              className={i % 3 === 1 ? 'lg:mt-16' : i % 3 === 2 ? 'lg:mt-8' : ''}
            >
              <figure data-scene className="group">
                <div className="relative aspect-[4/5] overflow-hidden bg-navy-deep">
                  <img
                    src={scene.image}
                    alt={scene.imageAlt}
                    loading="lazy"
                    decoding="async"
                    className="h-[112%] w-full -translate-y-[5%] object-cover transition-transform duration-700 ease-brand group-hover:scale-[1.03]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-navy-deep/10 transition-opacity duration-700 group-hover:opacity-0"
                  />
                </div>
                <figcaption className="mt-4 flex items-baseline justify-between gap-4 border-t border-cream/12 pt-4">
                  <span className="display-type text-lg text-cream">{scene.label}</span>
                  <span className="label-type text-cream/45">{scene.caption}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
