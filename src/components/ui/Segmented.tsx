type Option = { id: string; label: string };

type Props = {
  name: string;
  legend: string;
  options: Option[];
  value: string;
  onChange: (id: string) => void;
  tone?: 'light' | 'dark';
  className?: string;
};

/** Radio group styled as a segmented switch. Arrow keys work natively. */
export default function Segmented({
  name,
  legend,
  options,
  value,
  onChange,
  tone = 'light',
  className = '',
}: Props) {
  const shell = tone === 'light' ? 'border-ink/15' : 'border-cream/20';
  const on = tone === 'light' ? 'bg-navy text-cream' : 'bg-cream text-navy';
  const off = tone === 'light' ? 'text-ink/55 hover:text-ink' : 'text-cream/55 hover:text-cream';

  return (
    <fieldset className={className}>
      <legend className="sr-only">{legend}</legend>
      <div className={`inline-flex border ${shell}`}>
        {options.map((option) => {
          const checked = option.id === value;
          return (
            <label
              key={option.id}
              className={`label-type relative cursor-pointer px-4 py-3 transition-colors duration-300 ease-swift sm:px-5 ${
                checked ? on : off
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.id}
                checked={checked}
                onChange={() => onChange(option.id)}
                className="peer sr-only"
              />
              <span className="absolute inset-0 ring-0 ring-gold/50 peer-focus-visible:ring-4" aria-hidden="true" />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
