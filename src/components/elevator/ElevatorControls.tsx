import type { CSSProperties, ReactNode } from 'react';
import { finishGroups, glassOptions, interiors, lightingOptions } from '../../data/colors';
import { useElevatorConfig } from '../../hooks/useElevatorConfig';

/**
 * Circular selector. A native radio input sits underneath, so keyboard, screen
 * reader and form semantics come for free — the ring, scale and shadow are the
 * only things we style.
 */
function Swatch({
  name,
  value,
  label,
  sub,
  checked,
  onSelect,
  style,
}: {
  name: string;
  value: string;
  label: string;
  sub?: string;
  checked: boolean;
  onSelect: () => void;
  style: CSSProperties;
}) {
  return (
    <label className="group flex w-16 cursor-pointer flex-col items-center gap-2.5 text-center sm:w-[4.5rem]">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onSelect}
        className="peer sr-only"
      />
      <span className="relative block h-12 w-12 rounded-full ring-0 ring-gold/45 transition-shadow peer-focus-visible:ring-4 sm:h-14 sm:w-14">
        <span
          aria-hidden="true"
          className={`absolute -inset-[6px] rounded-full border border-gold transition-all duration-500 ease-brand ${
            checked ? 'scale-100 opacity-100' : 'scale-[0.72] opacity-0'
          }`}
        />
        <span
          aria-hidden="true"
          className={`absolute inset-0 rounded-full border border-ink/15 transition-transform duration-300 ease-brand ${
            checked ? 'scale-[1.06]' : 'group-hover:scale-[1.05]'
          }`}
          style={{
            ...style,
            boxShadow: checked ? '0 12px 26px -12px rgba(17,24,39,0.6)' : '0 2px 6px -3px rgba(17,24,39,0.35)',
          }}
        />
      </span>
      <span className={`label-type transition-colors duration-300 ${checked ? 'text-current' : 'opacity-50'}`}>
        {label}
      </span>
      {sub && <span className="sr-only">{sub}</span>}
    </label>
  );
}

function Group({ legend, note, children }: { legend: string; note?: string; children: ReactNode }) {
  return (
    <fieldset className="border-t border-current/10 pt-6">
      <legend className="sr-only">{legend}</legend>
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <p className="label-type">{legend}</p>
        {note && <p className="text-xs opacity-50">{note}</p>}
      </div>
      <div className="flex flex-wrap gap-x-2 gap-y-5">{children}</div>
    </fieldset>
  );
}

export default function ElevatorControls() {
  const { config, setFinish, setGlass, setInterior, setLighting } = useElevatorConfig();

  return (
    <div className="flex flex-col gap-9">
      {finishGroups.map((group) => (
        <Group key={group.id} legend={group.label} note={group.note}>
          {group.finishes.map((finish) => (
            <Swatch
              key={finish.id}
              name="exterior-finish"
              value={finish.id}
              label={finish.name}
              checked={config.exteriorColor === finish.id}
              onSelect={() => setFinish(finish.id, finish.family)}
              style={{
                background:
                  group.id === 'metallic'
                    ? `linear-gradient(140deg, color-mix(in srgb, ${finish.hex} 55%, white), ${finish.hex} 48%, color-mix(in srgb, ${finish.hex} 68%, black))`
                    : group.id === 'textured'
                      ? `radial-gradient(120% 120% at 30% 20%, color-mix(in srgb, ${finish.hex} 80%, white), ${finish.hex})`
                      : finish.hex,
              }}
            />
          ))}
        </Group>
      ))}

      <Group legend="Glass" note="Tube and door glazing">
        {glassOptions.map((glass) => (
          <Swatch
            key={glass.id}
            name="glass"
            value={glass.id}
            label={glass.name}
            sub={glass.note}
            checked={config.glass === glass.id}
            onSelect={() => setGlass(glass.id)}
            style={{
              // Reads as glazing: a light edge highlight over the tint.
              background: `linear-gradient(135deg, color-mix(in srgb, ${glass.hex} 35%, white) 0%, ${glass.hex} 55%, color-mix(in srgb, ${glass.hex} 75%, black) 100%)`,
            }}
          />
        ))}
      </Group>

      <Group legend="Interior" note="Cabin floor plates">
        {interiors.map((interior) => (
          <Swatch
            key={interior.id}
            name="interior"
            value={interior.id}
            label={interior.name}
            sub={interior.note}
            checked={config.interior === interior.id}
            onSelect={() => setInterior(interior.id)}
            style={{
              background: `linear-gradient(150deg, ${interior.hex} 0%, ${interior.accent} 58%, color-mix(in srgb, ${interior.hex} 58%, black) 100%)`,
            }}
          />
        ))}
      </Group>

      <Group legend="Lighting" note="Cabin colour temperature">
        {lightingOptions.map((light) => (
          <Swatch
            key={light.id}
            name="lighting"
            value={light.id}
            label={light.name}
            sub={`${light.kelvin} — ${light.note}`}
            checked={config.lighting === light.id}
            onSelect={() => setLighting(light.id)}
            style={{
              background: `radial-gradient(70% 70% at 50% 26%, white 0%, ${light.hex} 46%, color-mix(in srgb, ${light.hex} 52%, #2b2f36) 100%)`,
            }}
          />
        ))}
      </Group>
    </div>
  );
}
