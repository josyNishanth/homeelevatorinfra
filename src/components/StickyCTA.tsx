import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, MessageCircle, Phone, X } from 'lucide-react';
import { brand } from '../data/content';

/**
 * Desktop: a quiet prompt bottom-right, only while the visitor is between the
 * hero and the contact form. Mobile: a bottom action bar with the three things
 * someone actually wants to do from a phone.
 */
export default function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Sections that already put a strong CTA on screen. The prompt stays out of
    // their way so it never sits on top of a Configure or Request button.
    const owned = ['pricing', 'customize', 'contact'];

    const onScroll = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.85;
      const inOwnedSection = owned.some((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const box = el.getBoundingClientRect();
        return box.top < window.innerHeight * 0.9 && box.bottom > window.innerHeight * 0.1;
      });
      setVisible(pastHero && !inOwnedSection);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const shown = visible && !dismissed;

  return (
    <>
      {/* Desktop */}
      <div
        className={`pointer-events-none fixed right-6 bottom-6 z-40 hidden transition-all duration-500 ease-brand md:block ${
          shown ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <div
          className={`${shown ? 'pointer-events-auto' : ''} relative flex items-center gap-5 border border-cream/15 bg-charcoal/95 py-4 pr-5 pl-6 text-cream shadow-[0_24px_50px_-30px_rgba(17,24,39,0.9)] backdrop-blur-sm`}
        >
          <div>
            <p className="label-type text-cream/50">Need help choosing?</p>
            <Link
              to="/contact"
              className="display-type mt-1 flex items-center gap-2 text-lg text-cream transition-colors hover:text-gold"
            >
              Get a quote
              <ArrowUpRight size={16} strokeWidth={1.6} aria-hidden="true" />
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss quote prompt"
            className="self-start text-cream/40 transition-colors hover:text-cream"
          >
            <X size={14} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* Mobile */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-cream/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg md:hidden">
        <div className="grid grid-cols-3">
          <a
            href={brand.phoneHref}
            className="label-type flex items-center justify-center gap-2 border-r border-ink/10 py-4 text-ink/70"
          >
            <Phone size={15} strokeWidth={1.7} aria-hidden="true" />
            Call
          </a>
          <a
            href={brand.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="label-type flex items-center justify-center gap-2 border-r border-ink/10 py-4 text-ink/70"
          >
            <MessageCircle size={15} strokeWidth={1.7} aria-hidden="true" />
            WhatsApp
          </a>
          <Link to="/contact" className="label-type flex items-center justify-center gap-2 bg-navy py-4 text-cream">
            Get quote
          </Link>
        </div>
      </div>
    </>
  );
}
