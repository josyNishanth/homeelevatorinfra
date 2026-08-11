import { ArrowUpRight } from 'lucide-react';
import { elevators } from '../data/elevators';
import { useElevatorConfig } from '../hooks/useElevatorConfig';
import { gsap, prefersReducedMotion, useGsap } from '../hooks/useScrollAnimation';
import Button from './ui/Button';
import MaskedHeading from './ui/MaskedHeading';
import Reveal from './ui/Reveal';
import Section, { Container, Eyebrow } from './ui/Section';

function ProductBlock({ index }: { index: number }) {
  const elevator = elevators[index];
  const { setModel } = useElevatorConfig();
  const flipped = index % 2 === 1;

  const scope = useGsap<HTMLDivElement>((el) => {
    if (prefersReducedMotion()) return;
    const image = el.querySelector('[data-parallax]');
    if (image) {
      gsap.fromTo(
        image,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    }
    gsap.from(el.querySelectorAll('[data-feature]'), {
      autoAlpha: 0,
      x: -14,
      duration: 0.6,
      stagger: 0.07,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 70%', once: true },
    });
  });

  return (
    <div
      ref={scope}
      className="grid items-center gap-10 border-t border-ink/10 py-12 md:py-16 lg:grid-cols-12 lg:gap-16"
    >
      <div className={`lg:col-span-5 ${flipped ? 'lg:order-last lg:col-start-8' : ''}`}>
        <div className="flex items-baseline gap-5">
          <span className="display-type text-5xl text-gold/35 md:text-6xl">{elevator.index}</span>
          <span className="label-type text-ink/45">{elevator.shortName}</span>
        </div>

        <h3 className="display-type mt-6 text-title">{elevator.name}</h3>
        <p className="mt-4 max-w-md text-lg text-ink/75 md:text-xl">{elevator.headline}</p>
        <p className="mt-5 max-w-md text-ink/60">{elevator.description}</p>

        <ul className="mt-9 max-w-md">
          {elevator.features.map((feature, i) => (
            <li
              key={feature}
              data-feature
              className="flex items-baseline gap-5 border-t border-ink/10 py-3.5 last:border-b"
            >
              <span className="label-type text-ink/35">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-sm text-ink/80">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-9 flex flex-wrap gap-4">
          <Button
            to="/customize"
            variant="primary"
            onClick={() => setModel(elevator.id)}
            icon={<ArrowUpRight size={15} strokeWidth={1.6} />}
          >
            Personalise this lift
          </Button>
          <Button to="/contact" variant="outline">
            Get a quote
          </Button>
        </div>
      </div>

      <div className={`lg:col-span-6 ${flipped ? 'lg:order-first lg:col-start-1' : 'lg:col-start-7'}`}>
        <Reveal scale={1.02} y={34} duration={1}>
          <figure className="relative overflow-hidden bg-cream-dim">
            <div data-parallax className="aspect-[4/5] w-full">
              <img
                src={elevator.image}
                alt={elevator.imageAlt}
                loading="lazy"
                decoding="async"
                className="h-[112%] w-full -translate-y-[5%] object-cover"
              />
            </div>
          </figure>
        </Reveal>
      </div>

      {/* Specification. Manufacturer figures, labelled as such.
          lg:order-last pins this after both text and image on flipped blocks
          too — otherwise it lands between them (image order-first, text
          order-last, this had no order and tied with neither). */}
      <div className="lg:order-last lg:col-span-12">
        <Reveal y={18}>
          <div className="border-t border-ink/12 pt-8">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <p className="label-type text-ink/45">Specification</p>
              <ul className="flex flex-wrap gap-x-3 gap-y-2">
                {elevator.siteRequirements.map((item) => (
                  <li key={item} className="label-type border border-ink/15 px-3 py-2 text-ink/55">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <dl className="mt-7 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
              {elevator.specifications.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-baseline justify-between gap-6 border-t border-ink/10 py-3.5"
                >
                  <dt className="label-type text-ink/45">{spec.label}</dt>
                  <dd className="text-right text-sm text-ink/85">{spec.value}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 max-w-2xl text-xs text-ink/45">{elevator.specNote}</p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

export default function ElevatorTypes() {
  return (
    <Section id="elevators" tone="cream" pad="lg">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow className="text-ink/50">The range</Eyebrow>
            </Reveal>
            <MaskedHeading
              as="h2"
              text={'Find the right elevator\nfor your home'}
              className="mt-7 text-display"
            />
          </div>
          <Reveal y={18} delay={0.1} className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <p className="text-ink/60">
              Three systems, each suited to a different kind of house. Compare them on space, form and the way
              the cabin will sit in the room.
            </p>
          </Reveal>
        </div>

        <div className="mt-10 lg:mt-12">
          {elevators.map((elevator, i) => (
            <ProductBlock key={elevator.id} index={i} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
