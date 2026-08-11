import { ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { brand, navLinks } from '../data/content';
import { elevators } from '../data/elevators';
import { services } from '../data/services';
import { Container } from './ui/Section';

export default function Footer() {
  return (
    <footer className="bg-navy-deep pb-24 text-cream md:pb-12">
      <Container>
        <div className="grid gap-12 border-b border-cream/12 py-16 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-5">
            <Link to="/" className="display-type text-2xl tracking-[0.02em] uppercase">
              {brand.wordmark.first} <span className="text-gold">{brand.wordmark.second}</span>
            </Link>
            <p className="mt-5 max-w-sm text-cream/55">
              Home elevators, vacuum lifts, hydraulic and cylindrical home lifts — designed, fabricated,
              installed and commissioned by one team.
            </p>
            <div className="mt-8 flex flex-col gap-2">
              {brand.phones.map((p) => (
                <a key={p.href} href={p.href} className="text-cream/80 underline-offset-4 hover:underline">
                  {p.display}
                </a>
              ))}
              <a href={`mailto:${brand.email}`} className="text-cream/80 underline-offset-4 hover:underline">
                {brand.email}
              </a>
              <p className="label-type mt-3 text-cream/40">Serving {brand.serviceArea}</p>
            </div>
          </div>

          <nav aria-label="Elevators" className="lg:col-span-2 lg:col-start-7">
            <p className="label-type text-gold/70">Elevators</p>
            <ul className="mt-5 flex flex-col gap-3">
              {elevators.map((elevator) => (
                <li key={elevator.id}>
                  <Link to="/elevators" className="text-sm text-cream/60 transition-colors hover:text-cream">
                    {elevator.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Solutions" className="lg:col-span-2">
            <p className="label-type text-gold/70">Solutions</p>
            <ul className="mt-5 flex flex-col gap-3">
              {services.map((service) => (
                <li key={service.id}>
                  <Link to="/solutions" className="text-sm text-cream/60 transition-colors hover:text-cream">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Site" className="lg:col-span-2">
            <p className="label-type text-gold/70">Site</p>
            <ul className="mt-5 flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-cream/60 transition-colors hover:text-cream">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-6 py-8">
          <p className="label-type text-cream/35">
            © {new Date().getFullYear()} {brand.name}. Starting prices shown; final quotation depends on
            configuration and site requirements.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="label-type flex items-center gap-2 text-cream/50 transition-colors hover:text-cream"
          >
            Back to top
            <ArrowUp size={14} strokeWidth={1.7} aria-hidden="true" />
          </button>
        </div>
      </Container>
    </footer>
  );
}
