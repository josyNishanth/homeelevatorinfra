import { ArrowUpRight } from 'lucide-react';
import { navLinks } from '../data/content';
import Button from '../components/ui/Button';
import MaskedHeading from '../components/ui/MaskedHeading';
import { Container, Eyebrow } from '../components/ui/Section';
import { Link } from 'react-router-dom';

/** Between floors. Says what happened and offers the way out. */
export default function NotFound() {
  return (
    <section className="flex min-h-[100svh] flex-col justify-center bg-navy-deep pt-32 pb-20 text-cream">
      <Container>
        <Eyebrow className="text-cream/50">404</Eyebrow>
        <MaskedHeading
          as="h1"
          text={'This floor\nis not served.'}
          className="mt-7 max-w-3xl text-display text-cream"
          onLoad
        />
        <p className="mt-7 max-w-md text-lead text-cream/65">
          The page you asked for does not exist. Pick a stop below, or send us your requirement directly.
        </p>

        <nav aria-label="All pages" className="mt-12 max-w-lg border-t border-cream/15">
          {navLinks.map((link, i) => (
            <Link
              key={link.to}
              to={link.to}
              className="group flex items-baseline gap-4 border-b border-cream/12 py-4 transition-colors hover:text-gold"
            >
              <span className="label-type text-gold/60">{String(i + 1).padStart(2, '0')}</span>
              <span className="display-type text-xl">{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-10">
          <Button to="/contact" variant="gold" icon={<ArrowUpRight size={15} strokeWidth={1.6} />}>
            Get a quote
          </Button>
        </div>
      </Container>
    </section>
  );
}
