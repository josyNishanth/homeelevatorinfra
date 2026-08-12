import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { ArrowUpRight, Check, Phone } from 'lucide-react';
import { brand } from '../data/content';
import { elevators } from '../data/elevators';
import { pricingTiers } from '../data/pricing';
import { finishLabel, useElevatorConfig } from '../hooks/useElevatorConfig';
import { findGlass, findInterior, findLighting } from '../data/colors';
import { gsap, prefersReducedMotion } from '../hooks/useScrollAnimation';
import Button from './ui/Button';
import MaskedHeading from './ui/MaskedHeading';
import Reveal from './ui/Reveal';
import Section, { Container, Eyebrow } from './ui/Section';

type Fields = {
  name: string;
  phone: string;
  email: string;
  city: string;
  floors: string;
  elevatorType: string;
  homeStage: string;
  message: string;
};

type Errors = Partial<Record<keyof Fields, string>>;

/* The form sits on a paper sheet, so fields are ink on cream, not cream on navy. */
const fieldShell =
  'w-full border-0 border-b border-ink/20 bg-transparent pt-5 pb-3 text-ink placeholder:text-ink/35 transition-colors duration-300 focus:border-gold focus:outline-none';

/** Cream sheet lifted off the navy section — the "paper" the request is written on. */
const sheet =
  'relative bg-gradient-to-b from-white to-cream-dim p-7 shadow-[0_50px_90px_-40px_rgba(6,28,60,0.8)] sm:p-9 md:p-11';

function Field({
  label,
  name,
  value,
  onChange,
  error,
  type = 'text',
  required,
  autoComplete,
  inputMode,
}: {
  label: string;
  name: keyof Fields;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: 'text' | 'tel' | 'email';
}) {
  const id = `quote-${name}`;
  return (
    <div className="relative">
      <label htmlFor={id} className="label-type text-ink/45">
        {label}
        {required && <span className="text-gold"> *</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${fieldShell} ${error ? 'border-alert' : ''}`}
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 text-xs text-alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default function QuoteForm() {
  const { config } = useElevatorConfig();
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const panel = useRef<HTMLDivElement>(null);

  const [fields, setFields] = useState<Fields>({
    name: '',
    phone: '',
    email: '',
    city: '',
    floors: config.floors,
    elevatorType: config.model,
    homeStage: 'existing',
    message: '',
  });

  // Keep the form in step with choices made further up the page.
  useEffect(() => {
    setFields((f) => ({ ...f, floors: config.floors, elevatorType: config.model }));
  }, [config.floors, config.model]);

  const set = (key: keyof Fields) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setFields((f) => ({ ...f, [key]: e.target.value }));

  const validate = (): Errors => {
    const next: Errors = {};
    if (!fields.name.trim()) next.name = 'Please tell us your name.';
    const digits = fields.phone.replace(/\D/g, '');
    if (digits.length < 10) next.phone = 'Enter a phone number we can reach you on.';
    if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) next.email = 'Check the email address.';
    if (!fields.city.trim()) next.city = 'Which city is the home in?';
    return next;
  };

  // No backend yet: submission is validated and acknowledged client-side.
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) {
      const first = document.querySelector<HTMLElement>('[aria-invalid="true"]');
      first?.focus();
      return;
    }
    setSent(true);
  };

  useEffect(() => {
    const el = panel.current;
    if (!el || !sent || prefersReducedMotion()) return;
    gsap.from(el.querySelectorAll('[data-done]'), {
      autoAlpha: 0,
      y: 18,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power3.out',
    });
  }, [sent]);

  const recap = [
    elevators.find((e) => e.id === config.model)?.shortName,
    config.floors,
    finishLabel(config),
    `${findGlass(config.glass).name} glass`,
    `${findInterior(config.interior).name} interior`,
    `${findLighting(config.lighting).name} lighting`,
  ].join(' · ');

  return (
    // Own page now, so it clears the fixed navbar itself.
    <Section id="quote" tone="navy" pad="lg" className="pt-32 md:pt-44">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow className="text-cream/50">Get a quote</Eyebrow>
            </Reveal>
            <MaskedHeading
              as="h2"
              text={"Let's find the right lift\nfor your home."}
              className="mt-7 text-display text-cream"
            />
            <Reveal y={18} delay={0.1}>
              <p className="mt-7 max-w-md text-lead text-cream/65">
                Send your configuration and we will come back with a written quotation and the next available
                slot for a site visit.
              </p>

              <dl className="mt-10 border-t border-cream/15 pt-6">
                <div className="flex items-baseline justify-between gap-6 py-3">
                  <dt className="label-type text-cream/45">Your configuration</dt>
                  <dd className="text-right text-sm text-cream/85">{recap}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-6 border-t border-cream/12 py-3">
                  <dt className="label-type text-cream/45">Phone</dt>
                  <dd className="flex flex-col items-end gap-1">
                    {brand.phones.map((p) => (
                      <a
                        key={p.href}
                        href={p.href}
                        className="text-sm text-cream/85 underline-offset-4 hover:underline"
                      >
                        {p.display}
                      </a>
                    ))}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-6 border-t border-cream/12 py-3">
                  <dt className="label-type text-cream/45">Email</dt>
                  <dd>
                    <a
                      href={`mailto:${brand.email}`}
                      className="text-sm text-cream/85 underline-offset-4 hover:underline"
                    >
                      {brand.email}
                    </a>
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            {sent ? (
              /* ponytail: submit-confirmation slot — drop the animation in here later. */
              <div ref={panel} className={sheet}>
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gold" />
                <span
                  data-done
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-charcoal"
                >
                  <Check size={24} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <h3 data-done className="display-type mt-8 text-title text-ink">
                  Thank you.
                </h3>
                <p data-done className="mt-4 max-w-md text-lead text-ink/70">
                  Our team will contact you shortly.
                </p>
                <dl data-done className="mt-9 border-t border-ink/15 pt-5">
                  <div className="flex items-baseline justify-between gap-6 py-2">
                    <dt className="label-type text-ink/45">Name</dt>
                    <dd className="text-sm text-ink/85">{fields.name}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-6 py-2">
                    <dt className="label-type text-ink/45">Phone</dt>
                    <dd className="text-sm text-ink/85">{fields.phone}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-6 py-2">
                    <dt className="label-type text-ink/45">Configuration</dt>
                    <dd className="max-w-[18rem] text-right text-sm text-ink/85">{recap}</dd>
                  </div>
                </dl>
                <div data-done className="mt-8 flex flex-wrap gap-4">
                  <Button href={brand.phoneHref} variant="gold" icon={<Phone size={15} strokeWidth={1.6} />}>
                    Call us now
                  </Button>
                  <Button variant="outline" onClick={() => setSent(false)}>
                    Send another request
                  </Button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                noValidate
                className={`${sheet} grid gap-x-8 gap-y-6 sm:grid-cols-2`}
              >
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gold" />
                <Field
                  label="Name"
                  name="name"
                  value={fields.name}
                  onChange={set('name')}
                  error={errors.name}
                  required
                  autoComplete="name"
                />
                <Field
                  label="Phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  value={fields.phone}
                  onChange={set('phone')}
                  error={errors.phone}
                  required
                  autoComplete="tel"
                />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  inputMode="email"
                  value={fields.email}
                  onChange={set('email')}
                  error={errors.email}
                  autoComplete="email"
                />
                <Field
                  label="City"
                  name="city"
                  value={fields.city}
                  onChange={set('city')}
                  error={errors.city}
                  required
                  autoComplete="address-level2"
                />

                <div>
                  <label htmlFor="quote-floors" className="label-type text-ink/45">
                    Number of floors
                  </label>
                  <select
                    id="quote-floors"
                    name="floors"
                    value={fields.floors}
                    onChange={set('floors')}
                    className={fieldShell}
                  >
                    {pricingTiers.map((tier) => (
                      <option key={tier.id} value={tier.id} className="text-ink">
                        {tier.id} — {tier.stops}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="quote-type" className="label-type text-ink/45">
                    Elevator type
                  </label>
                  <select
                    id="quote-type"
                    name="elevatorType"
                    value={fields.elevatorType}
                    onChange={set('elevatorType')}
                    className={fieldShell}
                  >
                    {elevators.map((elevator) => (
                      <option key={elevator.id} value={elevator.id} className="text-ink">
                        {elevator.name}
                      </option>
                    ))}
                    <option value="undecided" className="text-ink">
                      Not sure yet
                    </option>
                  </select>
                </div>

                <fieldset className="sm:col-span-2">
                  <legend className="label-type text-ink/45">Home</legend>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {[
                      { id: 'new', label: 'New home' },
                      { id: 'existing', label: 'Existing home' },
                    ].map((option) => (
                      <label
                        key={option.id}
                        className={`label-type relative cursor-pointer border px-5 py-3 transition-colors duration-300 ${
                          fields.homeStage === option.id
                            ? 'border-gold bg-gold text-charcoal'
                            : 'border-ink/20 text-ink/60 hover:border-ink/45 hover:text-ink'
                        }`}
                      >
                        <input
                          type="radio"
                          name="homeStage"
                          value={option.id}
                          checked={fields.homeStage === option.id}
                          onChange={set('homeStage')}
                          className="peer sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 ring-0 ring-gold/50 peer-focus-visible:ring-4"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="sm:col-span-2">
                  <label htmlFor="quote-message" className="label-type text-ink/45">
                    Message
                  </label>
                  <textarea
                    id="quote-message"
                    name="message"
                    rows={3}
                    value={fields.message}
                    onChange={set('message')}
                    placeholder="Where should the lift sit? Anything we should know about the site?"
                    className={`${fieldShell} resize-none`}
                  />
                </div>

                <div className="flex flex-wrap gap-4 sm:col-span-2">
                  <Button type="submit" variant="gold" icon={<ArrowUpRight size={15} strokeWidth={1.6} />}>
                    Request a quote
                  </Button>
                  <Button href={brand.phoneHref} variant="outline" icon={<Phone size={15} strokeWidth={1.6} />}>
                    Book a site visit
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
