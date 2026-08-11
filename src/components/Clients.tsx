import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { coverage, coverageTotals, namedClients, sectors } from '../data/clients';
import { gsap, prefersReducedMotion, useGsap } from '../hooks/useScrollAnimation';
import CountUp from './ui/CountUp';
import MaskedHeading from './ui/MaskedHeading';
import Reveal from './ui/Reveal';
import Section, { Container, Eyebrow } from './ui/Section';

/** City names drifting sideways — coverage read as movement rather than a map. */
function CoverageMarquee({ cities, reverse = false }: { cities: string[]; reverse?: boolean }) {
  const scope = useGsap<HTMLDivElement>(
    (el) => {
      const track = el.querySelector<HTMLElement>('[data-marquee]');
      if (!track || prefersReducedMotion()) return;

      const tween = gsap.fromTo(
        track,
        { xPercent: reverse ? -50 : 0 },
        { xPercent: reverse ? 0 : -50, duration: 46, ease: 'none', repeat: -1 },
      );
      el.addEventListener('pointerenter', () => tween.timeScale(0.15));
      el.addEventListener('pointerleave', () => tween.timeScale(1));
    },
    [reverse, cities.length],
  );

  return (
    <div ref={scope} className="relative overflow-hidden py-4" aria-hidden="true">
      <div data-marquee className="flex w-max items-center gap-8">
        {[...cities, ...cities].map((city, i) => (
          <span key={`${city}-${i}`} className="flex shrink-0 items-center gap-8">
            <span className="display-type text-2xl whitespace-nowrap text-cream/35 md:text-3xl">{city}</span>
            <span className="h-1 w-1 shrink-0 rounded-full bg-gold/60" />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Clients() {
  const [focus, setFocus] = useState<string | null>(null);

  const wall = useGsap<HTMLUListElement>(
    (el) => {
      if (prefersReducedMotion()) return;
      // Each <li> also carries a Tailwind opacity-100/opacity-25 class that the
      // sector filter toggles later. Inline styles always beat a class, so the
      // entrance tween must hand its opacity/transform back with clearProps —
      // otherwise the filter click would have no visible effect afterwards.
      gsap.from(el.children, {
        autoAlpha: 0,
        y: 14,
        duration: 0.5,
        stagger: 0.02,
        ease: 'power2.out',
        clearProps: 'opacity,visibility,transform',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    },
    [],
  );

  const allCities = coverage.flatMap((r) => r.cities);

  return (
    <Section id="clients" tone="charcoal" pad="lg">
      <Container>
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow className="text-cream/50">Clients</Eyebrow>
            </Reveal>
            <MaskedHeading
              as="h2"
              text={'Where these lifts\nalready live'}
              className="mt-7 text-display text-cream"
            />
          </div>
          <Reveal y={18} delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <p className="text-cream/60">
              Homes, consulting rooms, guest houses and showrooms across two states — chosen by people whose
              buildings had to keep working while the lift went in.
            </p>
          </Reveal>
        </div>

        {/* Counters */}
        <div className="mt-14 grid gap-y-10 border-t border-cream/15 pt-10 sm:grid-cols-3 lg:mt-20">
          {[
            { value: coverageTotals.cities, suffix: '+', label: 'Cities and towns' },
            { value: coverageTotals.regions, suffix: '', label: 'States covered' },
            { value: coverageTotals.namedClients, suffix: '+', label: 'Named clients' },
          ].map((stat, i) => (
            <div key={stat.label} className={i > 0 ? 'sm:border-l sm:border-cream/12 sm:pl-8' : ''}>
              <p className="display-type text-6xl text-cream md:text-7xl">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="label-type mt-3 text-cream/45">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Sectors act as a focus control for the name wall. */}
        <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="label-type text-cream/45">By sector</p>
            <div className="mt-6 flex flex-col">
              <button
                type="button"
                onClick={() => setFocus(null)}
                aria-pressed={focus === null}
                className={`flex items-baseline justify-between gap-4 border-t border-cream/12 py-4 text-left transition-colors duration-300 ${
                  focus === null ? 'text-cream' : 'text-cream/45 hover:text-cream/80'
                }`}
              >
                <span className="display-type text-lg">All clients</span>
                <span className="label-type text-gold/70">{namedClients.length}</span>
              </button>

              {sectors.map((sector) => {
                const on = focus === sector.id;
                return (
                  <button
                    key={sector.id}
                    type="button"
                    onClick={() => setFocus(on ? null : sector.id)}
                    aria-pressed={on}
                    className={`group border-t border-cream/12 py-4 text-left transition-colors duration-300 ${
                      on ? 'text-cream' : 'text-cream/45 hover:text-cream/80'
                    }`}
                  >
                    <span className="flex items-baseline justify-between gap-4">
                      <span className="display-type text-lg">{sector.label}</span>
                      <span className={`label-type ${on ? 'text-gold' : 'text-cream/30'}`}>
                        {namedClients.filter((c) => c.sector === sector.id).length}
                      </span>
                    </span>
                    <span
                      className={`mt-2 block max-w-xs text-sm transition-opacity duration-300 ${
                        on ? 'text-cream/55 opacity-100' : 'text-cream/40 opacity-70'
                      }`}
                    >
                      {sector.note}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name wall — dims rather than filters, so the full list stays legible. */}
          <div className="lg:col-span-7 lg:col-start-6">
            <p className="label-type text-cream/45">
              {focus ? sectors.find((s) => s.id === focus)?.label : 'Every named client'}
            </p>
            <ul ref={wall} className="mt-6">
              {namedClients.map((client) => {
                const dim = focus !== null && client.sector !== focus;
                return (
                  <li
                    key={client.name}
                    className={`flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-cream/12 py-3.5 transition-opacity duration-500 ease-brand ${
                      dim ? 'opacity-25' : 'opacity-100'
                    }`}
                  >
                    <span className="display-type text-base text-cream md:text-lg">{client.name}</span>
                    <span className="flex items-baseline gap-3">
                      {client.city && (
                        <span className="label-type flex items-center gap-1.5 text-gold/60">
                          <MapPin size={11} strokeWidth={1.8} aria-hidden="true" />
                          {client.city}
                        </span>
                      )}
                      <span className="label-type text-cream/40">{client.role}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>

      {/* Coverage. Full-bleed, so it reads as territory rather than a list. */}
      <div className="mt-20 border-y border-cream/12 py-4">
        <Container>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 pb-4">
            <p className="label-type flex items-center gap-2 text-gold">
              <MapPin size={12} strokeWidth={1.8} aria-hidden="true" />
              Coverage
            </p>
            {coverage.map((region) => (
              <p key={region.id} className="label-type text-cream/45">
                {region.label} · {region.cities.length} locations
              </p>
            ))}
          </div>
        </Container>

        <CoverageMarquee cities={coverage[0].cities} />
        <CoverageMarquee cities={coverage[1].cities} reverse />

        {/* The marquee is decorative; the list itself stays readable to everyone. */}
        <Container>
          <p className="sr-only">Locations served: {allCities.join(', ')}.</p>
        </Container>
      </div>
    </Section>
  );
}
