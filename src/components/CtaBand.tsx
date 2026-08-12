import { ArrowUpRight, Phone } from 'lucide-react';
import { brand } from '../data/content';
import Button from './ui/Button';
import MaskedHeading from './ui/MaskedHeading';
import Reveal from './ui/Reveal';
import Section, { Container, Eyebrow } from './ui/Section';

type Props = {
  eyebrow?: string;
  title?: string;
  lead?: string;
};

/** Closing band. Ends every route on the same two actions. */
export default function CtaBand({
  eyebrow = 'Next step',
  title = 'Tell us about your home.',
  lead = 'Send your floors and the space you have in mind. We come back with a written quotation and a slot for a site visit.',
}: Props) {
  return (
    <Section tone="navy" pad="md">
      <Container>
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow className="text-cream/50">{eyebrow}</Eyebrow>
            </Reveal>
            <MaskedHeading as="h2" text={title} className="mt-6 text-title text-cream" />
            <Reveal y={16} delay={0.1}>
              <p className="mt-5 max-w-lg text-cream/65">{lead}</p>
            </Reveal>
          </div>

          <Reveal y={18} delay={0.15} className="lg:col-span-4 lg:col-start-9">
            <div className="flex flex-wrap gap-4">
              <Button to="/quote" variant="gold" icon={<ArrowUpRight size={15} strokeWidth={1.6} />}>
                Get a quote
              </Button>
              <Button href={brand.phoneHref} variant="onDark" icon={<Phone size={15} strokeWidth={1.6} />}>
                Book a site visit
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
