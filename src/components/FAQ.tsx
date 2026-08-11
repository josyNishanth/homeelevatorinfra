import { useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { faqs } from '../data/faqs';
import { gsap, prefersReducedMotion } from '../hooks/useScrollAnimation';
import MaskedHeading from './ui/MaskedHeading';
import Reveal from './ui/Reveal';
import Section, { Container, Eyebrow } from './ui/Section';

function Item({ id, question, answer }: { id: string; question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  const toggle = () => {
    const el = panel.current;
    const next = !open;
    setOpen(next);
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el, { height: next ? 'auto' : 0, autoAlpha: next ? 1 : 0 });
      return;
    }
    gsap.to(el, {
      height: next ? 'auto' : 0,
      autoAlpha: next ? 1 : 0,
      duration: 0.45,
      ease: 'power2.inOut',
    });
  };

  return (
    <div className="border-t border-ink/12 last:border-b">
      <h3>
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls={`faq-${id}`}
          className="group flex w-full items-start justify-between gap-8 py-6 text-left"
        >
          <span className="display-type max-w-2xl text-lg transition-colors duration-300 group-hover:text-navy md:text-xl">
            {question}
          </span>
          <span
            aria-hidden="true"
            className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center border border-ink/15 text-ink/50 transition-all duration-500 ease-brand ${
              open ? 'rotate-45 border-navy bg-navy text-cream' : 'group-hover:border-ink/40'
            }`}
          >
            <Plus size={15} strokeWidth={1.6} />
          </span>
        </button>
      </h3>

      <div
        id={`faq-${id}`}
        ref={panel}
        inert={!open}
        aria-hidden={!open}
        className="h-0 overflow-hidden opacity-0"
      >
        <p className="max-w-2xl pb-7 text-ink/65">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <Section tone="white" pad="lg">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <Eyebrow className="text-ink/50">Questions</Eyebrow>
            </Reveal>
            <MaskedHeading as="h2" text={'Answers before\nthe site visit'} className="mt-7 text-title" />
            <p className="mt-6 max-w-xs text-sm text-ink/55">
              Anything not covered here is confirmed during the site assessment for your specific home.
            </p>
          </div>

          <Reveal stagger={0.06} className="lg:col-span-7 lg:col-start-6">
            {faqs.map((faq) => (
              <Item key={faq.id} {...faq} />
            ))}
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
