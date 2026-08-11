import { ArrowUpRight } from 'lucide-react';
import { services } from '../data/services';
import MaskedHeading from './ui/MaskedHeading';
import Reveal from './ui/Reveal';
import Section, { Container, Eyebrow } from './ui/Section';

/**
 * Services read as an index rather than a card grid: the row is the interface,
 * and the visual arrives on hover. On touch and small screens the image is
 * always shown, so nothing depends on hovering.
 */
export default function Services() {
  return (
    <Section id="solutions" tone="cream" pad="lg">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow className="text-ink/50">Solutions</Eyebrow>
            </Reveal>
            <MaskedHeading as="h2" text={'Everything between\nthe drawing and the ride'} className="mt-7 text-display" />
          </div>
          <Reveal y={18} delay={0.1} className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <p className="text-ink/60">
              Structure design, fabrication, installation and commissioning are handled by one team — plus solar
              water heating for the same home.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 lg:mt-20">
          {services.map((service) => (
            <Reveal key={service.id} y={22}>
              <article className="group relative grid gap-6 border-t border-ink/12 py-8 lg:grid-cols-12 lg:items-start lg:gap-10 lg:py-10">
                <div className="lg:col-span-1">
                  <span className="display-type text-3xl text-gold/40 lg:text-4xl">{service.index}</span>
                </div>

                <div className="lg:col-span-5">
                  <h3 className="display-type text-2xl transition-colors duration-500 group-hover:text-navy lg:text-3xl">
                    {service.title}
                  </h3>
                  <p className="mt-3 max-w-md text-ink/60">{service.description}</p>
                  <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink/45">
                    {service.deliverables.map((item, i) => (
                      <li key={item} className="flex items-center gap-4">
                        {i > 0 && <span aria-hidden="true" className="h-3 w-px bg-ink/20" />}
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="lg:col-span-5 lg:col-start-7">
                  <div className="relative aspect-[16/10] overflow-hidden bg-cream-dim lg:aspect-[16/9]">
                    <img
                      src={service.image}
                      alt={service.imageAlt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full scale-[1.04] object-cover transition-all duration-700 ease-brand lg:opacity-70 lg:group-hover:scale-100 lg:group-hover:opacity-100"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-navy/25 opacity-0 transition-opacity duration-700 lg:opacity-100 lg:group-hover:opacity-0"
                    />
                  </div>
                </div>

                <div className="lg:col-span-1 lg:col-start-12 lg:justify-self-end">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-11 w-11 items-center justify-center border border-ink/15 text-ink/45 transition-all duration-500 ease-brand group-hover:border-navy group-hover:bg-navy group-hover:text-cream"
                  >
                    <ArrowUpRight size={16} strokeWidth={1.6} />
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
