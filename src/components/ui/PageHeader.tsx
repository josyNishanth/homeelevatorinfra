import type { ReactNode } from 'react';
import { navLinks } from '../../data/content';
import MaskedHeading from './MaskedHeading';
import Reveal from './Reveal';
import { Container, Eyebrow } from './Section';

type Props = {
  eyebrow: string;
  /** Use \n to force a line break. */
  title: string;
  lead: string;
  /** Small mono facts under the lead — kept to things we can evidence. */
  facts?: { label: string; value: string }[];
  children?: ReactNode;
};

/**
 * Opening band on every route except home. Deep navy so the transparent navbar
 * still reads over it, and tall enough that the page does not start mid-air.
 */
export default function PageHeader({ eyebrow, title, lead, facts, children }: Props) {
  const index = navLinks.findIndex((l) => l.label.toLowerCase() === eyebrow.toLowerCase());

  return (
    <header className="relative isolate overflow-hidden bg-navy-deep pt-32 pb-16 text-cream md:pt-40 md:pb-24">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <img
          src="/images/hero/backdrop.svg"
          alt=""
          className="h-full w-full object-cover opacity-25"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-deep via-navy-deep/85 to-charcoal/95" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_15%_85%,rgba(185,149,90,0.14),transparent_70%)]" />
      </div>

      <Container>
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow className="text-cream/55">
                {index >= 0 ? `${String(index + 1).padStart(2, '0')} — ${eyebrow}` : eyebrow}
              </Eyebrow>
            </Reveal>
            <MaskedHeading as="h1" text={title} className="mt-7 text-display text-cream" onLoad delay={0.15} />
          </div>

          <Reveal y={18} delay={0.25} className="lg:col-span-4 lg:col-start-9">
            <p className="text-lead text-cream/70">{lead}</p>
          </Reveal>
        </div>

        {facts && (
          <Reveal stagger={0.08} className="mt-12 grid gap-y-6 border-t border-cream/15 pt-8 sm:grid-cols-3">
            {facts.map((fact, i) => (
              <div key={fact.label} className={i > 0 ? 'sm:border-l sm:border-cream/12 sm:pl-8' : ''}>
                <p className="label-type text-gold/70">{fact.label}</p>
                <p className="mt-2 text-cream/80">{fact.value}</p>
              </div>
            ))}
          </Reveal>
        )}

        {children}
      </Container>
    </header>
  );
}
