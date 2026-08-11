import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Variant = 'primary' | 'gold' | 'outline' | 'onDark' | 'quiet';

const base =
  'group relative inline-flex items-center justify-center gap-3 overflow-hidden px-7 py-4 label-type transition-colors duration-300 ease-swift disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<Variant, { shell: string; sweep: string }> = {
  primary: {
    shell: 'bg-navy text-cream',
    sweep: 'bg-navy-lift',
  },
  gold: {
    shell: 'bg-gold text-charcoal',
    sweep: 'bg-gold-lift',
  },
  outline: {
    shell: 'border border-ink/25 text-ink hover:text-cream',
    sweep: 'bg-navy',
  },
  onDark: {
    shell: 'border border-cream/35 text-cream hover:text-navy',
    sweep: 'bg-cream',
  },
  quiet: {
    shell: 'px-0 py-2 text-ink/70 hover:text-ink',
    sweep: 'bg-transparent',
  },
};

type CommonProps = {
  variant?: Variant;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
};

type ButtonProps = CommonProps & ComponentPropsWithoutRef<'button'> & { href?: undefined; to?: undefined };
/** External or protocol link (tel:, https:, mailto:). */
type AnchorProps = CommonProps & ComponentPropsWithoutRef<'a'> & { href: string; to?: undefined };
/** In-app route — renders a router Link so navigation stays client-side. */
type RouteProps = CommonProps & Omit<ComponentPropsWithoutRef<'a'>, 'href'> & { to: string; href?: undefined };

export default function Button(props: ButtonProps | AnchorProps | RouteProps) {
  const { variant = 'primary', children, icon, className = '', ...rest } = props;
  const v = variants[variant];
  const cls = `${base} ${v.shell} ${className}`;

  const inner = (
    <>
      {variant !== 'quiet' && (
        <span
          aria-hidden="true"
          className={`absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-brand group-hover:scale-x-100 ${v.sweep}`}
        />
      )}
      <span className="relative z-10">{children}</span>
      {icon && (
        <span className="relative z-10 transition-transform duration-300 ease-brand group-hover:translate-x-1">
          {icon}
        </span>
      )}
    </>
  );

  if ('to' in rest && rest.to) {
    const { to, ...linkRest } = rest as { to: string } & ComponentPropsWithoutRef<'a'>;
    return (
      <Link to={to} className={cls} {...linkRest}>
        {inner}
      </Link>
    );
  }

  if ('href' in rest && rest.href) {
    return (
      <a className={cls} {...(rest as ComponentPropsWithoutRef<'a'>)}>
        {inner}
      </a>
    );
  }

  return (
    <button className={cls} {...(rest as ComponentPropsWithoutRef<'button'>)}>
      {inner}
    </button>
  );
}
