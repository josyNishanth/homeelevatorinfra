import { ArrowUpRight, Minus } from 'lucide-react';
import { PRICE_DISCLAIMER, formatRupees, pricingTiers } from '../data/pricing';
import { useElevatorConfig } from '../hooks/useElevatorConfig';
import { useCountUp } from '../hooks/useScrollAnimation';
import Button from './ui/Button';
import MaskedHeading from './ui/MaskedHeading';
import Reveal from './ui/Reveal';
import Section, { Container, Eyebrow } from './ui/Section';

export default function Pricing() {
  const { config, setFloors, basePrice } = useElevatorConfig();
  const priceRef = useCountUp(basePrice, formatRupees);

  return (
    <Section id="pricing" tone="cream" pad="lg">
      <Container>
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal>
              <Eyebrow className="text-ink/50">Pricing</Eyebrow>
            </Reveal>
            <MaskedHeading as="h2" text="Choose your height" className="mt-7 text-display" />
          </div>

          <Reveal y={18} delay={0.1} className="lg:col-span-5 lg:col-start-8">
            <p className="label-type text-ink/45">Selected · {config.floors}</p>
            <p className="display-type mt-3 text-5xl md:text-6xl" aria-live="polite">
              <span ref={priceRef}>{formatRupees(basePrice)}</span>
            </p>
            <p className="mt-4 max-w-sm text-sm text-ink/55">{PRICE_DISCLAIMER}</p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 lg:mt-20 lg:grid-cols-3 lg:gap-6">
          {pricingTiers.map((tier, i) => {
            const selected = tier.id === config.floors;
            return (
              <Reveal key={tier.id} y={26} delay={i * 0.08}>
                <article
                  className={`relative flex h-full flex-col justify-between p-7 transition-[transform,background-color,color,box-shadow] duration-500 ease-brand md:p-8 ${
                    selected
                      ? 'bg-navy text-cream shadow-[0_40px_70px_-45px_rgba(8,43,92,0.85)] lg:-translate-y-2'
                      : 'bg-white text-ink shadow-[0_18px_40px_-38px_rgba(17,24,39,0.5)]'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute inset-0 border transition-colors duration-500 ${
                      selected ? 'border-gold' : 'border-ink/12'
                    }`}
                  />

                  <div className="relative">
                    <div className="flex items-start justify-between gap-4">
                      <p className={`label-type ${selected ? 'text-gold' : 'text-ink/40'}`}>{tier.stops}</p>
                      {selected && <span className="label-type text-cream/60">Selected</span>}
                    </div>

                    <p className="display-type mt-7 text-6xl md:text-7xl">{tier.id}</p>
                    <p className={`mt-4 text-2xl ${selected ? 'text-cream' : 'text-ink'}`}>{tier.priceShort}</p>
                    <p className={`mt-2 text-sm ${selected ? 'text-cream/55' : 'text-ink/50'}`}>{tier.suitedTo}</p>

                    <ul className="mt-8">
                      {tier.includes.map((item) => (
                        <li
                          key={item}
                          className={`flex items-baseline gap-3 border-t py-3 text-sm ${
                            selected ? 'border-cream/12 text-cream/75' : 'border-ink/10 text-ink/70'
                          }`}
                        >
                          <Minus
                            size={12}
                            strokeWidth={2}
                            aria-hidden="true"
                            className={selected ? 'text-gold' : 'text-ink/30'}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="relative mt-9">
                    <Button
                      to="/customize"
                      variant={selected ? 'gold' : 'outline'}
                      onClick={() => setFloors(tier.id)}
                      className="w-full"
                      icon={<ArrowUpRight size={15} strokeWidth={1.6} />}
                    >
                      Configure {tier.id}
                    </Button>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
