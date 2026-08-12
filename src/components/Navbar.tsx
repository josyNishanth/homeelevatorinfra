import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { brand, navLinks } from '../data/content';
import { gsap, prefersReducedMotion } from '../hooks/useScrollAnimation';
import Button from './ui/Button';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const overlay = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  // Navigating with the menu open should close it.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Full-screen mobile menu: clip-path wipe, then the links stagger in.
  useEffect(() => {
    const el = overlay.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>('[data-nav-item]');
    const reduced = prefersReducedMotion();

    if (open) {
      gsap.set(el, { display: 'flex' });
      if (reduced) {
        gsap.set([el, items], { clipPath: 'none', y: 0, autoAlpha: 1 });
        return;
      }
      const tl = gsap.timeline();
      tl.fromTo(
        el,
        { clipPath: 'inset(0% 0% 100% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.62, ease: 'power3.inOut' },
      ).from(items, { y: 28, autoAlpha: 0, stagger: 0.055, duration: 0.5, ease: 'power3.out' }, '-=0.28');
      return () => {
        tl.kill();
      };
    }

    if (reduced) {
      gsap.set(el, { display: 'none' });
      return;
    }
    const tween = gsap.to(el, {
      clipPath: 'inset(0% 0% 100% 0%)',
      duration: 0.45,
      ease: 'power3.inOut',
      onComplete: () => gsap.set(el, { display: 'none' }),
    });
    return () => {
      tween.kill();
    };
  }, [open]);

  // Lock the page behind the menu and let Escape close it.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <>
      <a
        href="#main"
        className="label-type sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] focus:bg-navy focus:px-4 focus:py-3 focus:text-cream"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color,backdrop-filter] duration-500 ease-swift ${
          solid
            ? 'border-b border-ink/10 bg-cream/85 shadow-[0_1px_30px_-12px_rgba(17,24,39,0.35)] backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div
          className={`mx-auto flex w-full max-w-[88rem] items-center justify-between gap-8 px-6 transition-[height] duration-500 ease-swift md:px-10 lg:px-16 ${
            scrolled ? 'h-16' : 'h-20 md:h-24'
          }`}
        >
          <Link
            to="/"
            aria-label={`${brand.name} — home`}
            className={`display-type flex items-baseline gap-1.5 text-sm whitespace-nowrap tracking-[0.02em] uppercase transition-colors duration-500 sm:text-base ${
              solid ? 'text-navy' : 'text-cream'
            }`}
          >
            <span>{brand.wordmark.first}</span>
            <span className="text-gold">{brand.wordmark.second}</span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `label-type group relative py-2 transition-colors duration-300 ${
                    isActive
                      ? solid
                        ? 'text-navy'
                        : 'text-cream'
                      : solid
                        ? 'text-ink/60 hover:text-navy'
                        : 'text-cream/65 hover:text-cream'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-0 bottom-0 h-px origin-left bg-gold transition-transform duration-500 ease-brand ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block">
              <Button
                to="/quote"
                variant={solid ? 'primary' : 'onDark'}
                className="px-6 py-3.5"
                icon={<ArrowUpRight size={15} strokeWidth={1.6} />}
              >
                Get a quote
              </Button>
            </span>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className={`flex h-11 w-11 items-center justify-center border transition-colors duration-300 lg:hidden ${
                solid ? 'border-ink/15 text-ink' : 'border-cream/30 text-cream'
              }`}
            >
              {open ? <X size={18} strokeWidth={1.6} /> : <Menu size={18} strokeWidth={1.6} />}
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={overlay}
        hidden={!open}
        className="fixed inset-0 z-40 hidden flex-col justify-between bg-navy px-6 pt-28 pb-10 text-cream lg:!hidden"
      >
        <nav aria-label="Mobile" className="flex flex-col">
          {navLinks.map((link, i) => (
            <NavLink
              key={link.to}
              data-nav-item
              to={link.to}
              end={link.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `display-type flex items-baseline gap-4 border-b border-cream/12 py-5 text-3xl transition-colors hover:text-gold sm:text-4xl ${
                  isActive ? 'text-gold' : 'text-cream/90'
                }`
              }
            >
              <span className="label-type text-gold/70">{String(i + 1).padStart(2, '0')}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div data-nav-item className="flex flex-col gap-4">
          <Button to="/quote" variant="gold" onClick={() => setOpen(false)} className="w-full">
            Get a quote
          </Button>
          <Button href={brand.phoneHref} variant="onDark" onClick={() => setOpen(false)} className="w-full">
            Book a site visit
          </Button>
          <p className="label-type mt-2 text-cream/40">{brand.phone}</p>
        </div>
      </div>
    </>
  );
}
