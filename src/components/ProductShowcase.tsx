import { ArrowUpRight, Check } from 'lucide-react';
import { elevators, findElevator } from '../data/elevators';
import { useElevatorConfig } from '../hooks/useElevatorConfig';
import { gsap, prefersReducedMotion, useGsap } from '../hooks/useScrollAnimation';
import type { ElevatorModel } from '../types/elevator';
import ElevatorViewer from './elevator/ElevatorViewer';
import Button from './ui/Button';
import MaskedHeading from './ui/MaskedHeading';
import Reveal from './ui/Reveal';
import Section, { Container, Eyebrow } from './ui/Section';

/**
 * Side-by-side comparison. The tabs write to the shared configuration, so the
 * choice made here carries into personalisation, the summary and the quote.
 */
export default function ProductShowcase() {
  const { config, setModel } = useElevatorConfig();
  const active = findElevator(config.model);

  const scope = useGsap<HTMLDivElement>(
    (el) => {
      if (prefersReducedMotion()) return;
      gsap.from(el.querySelectorAll('[data-swap]'), {
        autoAlpha: 0,
        y: 16,
        duration: 0.55,
        stagger: 0.05,
        ease: 'power2.out',
      });
    },
    [config.model],
  );

  return (
    <Section tone="navy" pad="lg">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal>
              <Eyebrow className="text-cream/50">Compare</Eyebrow>
            </Reveal>
            <MaskedHeading as="h2" text={'One page.\nThree systems.'} className="mt-7 text-display text-cream" />
          </div>
          <Reveal y={18} delay={0.1} className="lg:col-span-5 lg:col-start-8 lg:self-end">
            <p className="text-cream/60">
              Switch between the three systems and watch the cabin, the form and the strengths change. Your
              selection follows you to the personalisation panel.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 border-t border-cream/15" role="tablist" aria-label="Elevator systems">
          <div className="flex flex-wrap">
            {elevators.map((elevator) => {
              const selected = elevator.id === config.model;
              return (
                <button
                  key={elevator.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="showcase-panel"
                  onClick={() => setModel(elevator.id as ElevatorModel)}
                  className={`group relative flex flex-1 items-baseline gap-3 px-1 py-6 text-left transition-colors duration-300 sm:px-5 ${
                    selected ? 'text-cream' : 'text-cream/45 hover:text-cream/80'
                  }`}
                >
                  <span className="label-type text-gold/70">{elevator.index}</span>
                  <span className="display-type text-xl sm:text-2xl">{elevator.shortName}</span>
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 -top-px h-px origin-left bg-gold transition-transform duration-500 ease-brand ${
                      selected ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div
          id="showcase-panel"
          ref={scope}
          role="tabpanel"
          className="grid gap-10 pt-12 lg:grid-cols-12 lg:gap-16"
        >
          <div className="lg:col-span-5">
            <p data-swap className="label-type text-gold">
              {active.specs.map((s) => s.value).join(' · ')}
            </p>
            <h3 data-swap className="display-type mt-6 text-title text-cream">
              {active.name}
            </h3>
            <p data-swap className="mt-5 max-w-md text-lead text-cream/70">
              {active.description}
            </p>

            <ul className="mt-9 grid max-w-md gap-3 sm:grid-cols-2">
              {active.features.map((feature) => (
                <li data-swap key={feature} className="flex items-start gap-3 text-sm text-cream/75">
                  <Check size={15} strokeWidth={1.8} className="mt-1 shrink-0 text-gold" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>

            <dl className="mt-9 grid max-w-md gap-x-8 sm:grid-cols-2">
              {active.specifications.slice(0, 4).map((spec) => (
                <div
                  data-swap
                  key={spec.label}
                  className="flex items-baseline justify-between gap-4 border-t border-cream/12 py-3"
                >
                  <dt className="label-type text-cream/40">{spec.label}</dt>
                  <dd className="text-right text-sm text-cream/85">{spec.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="#customize" variant="gold" icon={<ArrowUpRight size={15} strokeWidth={1.6} />}>
                Personalise this lift
              </Button>
              <Button href="#contact" variant="onDark">
                Book a site visit
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <ElevatorViewer
              config={config}
              mode="image"
              image={active.image}
              alt={active.imageAlt}
              className="aspect-[4/5] w-full bg-navy-deep"
            >
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-navy-deep/90 to-transparent p-6 pt-20">
                <span className="label-type text-cream/70">{active.shortName}</span>
                <span className="label-type text-gold/80">{config.floors}</span>
              </div>
            </ElevatorViewer>
          </div>
        </div>
      </Container>
    </Section>
  );
}
