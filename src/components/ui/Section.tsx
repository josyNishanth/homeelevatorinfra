import type { ReactNode } from 'react';

type Tone = 'cream' | 'white' | 'navy' | 'charcoal';

const tones: Record<Tone, string> = {
  cream: 'bg-cream text-ink',
  white: 'bg-white text-ink',
  navy: 'bg-navy text-cream',
  charcoal: 'bg-charcoal text-cream',
};

type Props = {
  id?: string;
  children: ReactNode;
  tone?: Tone;
  /** Vertical rhythm. All section padding is decided here and nowhere else. */
  pad?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
};

const pads = {
  none: '',
  sm: 'py-16 md:py-20',
  md: 'py-20 md:py-28 lg:py-32',
  lg: 'py-24 md:py-36 lg:py-44',
};

export default function Section({ id, children, tone = 'cream', pad = 'md', className = '' }: Props) {
  return (
    <section id={id} className={`relative ${tones[tone]} ${pads[pad]} ${className}`}>
      {children}
    </section>
  );
}

/** Shared page gutter. Keeps every section on the same measure. */
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[88rem] px-6 md:px-10 lg:px-16 ${className}`}>{children}</div>;
}

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`label-type flex items-center gap-3 ${className}`}>
      <span aria-hidden="true" className="inline-block h-px w-8 bg-gold" />
      {children}
    </p>
  );
}
