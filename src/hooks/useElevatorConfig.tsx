import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ElevatorConfiguration, FinishFamily, FloorsKey, ElevatorModel } from '../types/elevator';
import { findFinish } from '../data/colors';
import { findTier } from '../data/pricing';

export const DEFAULT_CONFIGURATION: ElevatorConfiguration = {
  model: 'cylindrical',
  floors: 'G+2',
  exteriorColor: 'black',
  texture: 'standard',
  interior: 'marble',
  lighting: 'premium',
};

type ConfigContext = {
  config: ElevatorConfiguration;
  /** Base starting price for the selected number of floors, in rupees. */
  basePrice: number;
  setModel: (model: ElevatorModel) => void;
  setFloors: (floors: FloorsKey) => void;
  /** Selecting a finish also records its family, so 3D materials can branch on it. */
  setFinish: (id: string, family: FinishFamily) => void;
  setInterior: (id: string) => void;
  setLighting: (id: string) => void;
  reset: () => void;
};

const Ctx = createContext<ConfigContext | null>(null);

/**
 * Single source of truth for the elevator the visitor is building. Pricing,
 * the personalisation panel, the summary card and the quote form all read from
 * here — and later, so will the Three.js scene.
 */
export function ElevatorConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ElevatorConfiguration>(DEFAULT_CONFIGURATION);

  const setModel = useCallback((model: ElevatorModel) => setConfig((c) => ({ ...c, model })), []);
  const setFloors = useCallback((floors: FloorsKey) => setConfig((c) => ({ ...c, floors })), []);
  const setFinish = useCallback(
    (id: string, family: FinishFamily) => setConfig((c) => ({ ...c, exteriorColor: id, texture: family })),
    [],
  );
  const setInterior = useCallback((interior: string) => setConfig((c) => ({ ...c, interior })), []);
  const setLighting = useCallback((lighting: string) => setConfig((c) => ({ ...c, lighting })), []);
  const reset = useCallback(() => setConfig(DEFAULT_CONFIGURATION), []);

  const value = useMemo<ConfigContext>(
    () => ({
      config,
      basePrice: findTier(config.floors).price,
      setModel,
      setFloors,
      setFinish,
      setInterior,
      setLighting,
      reset,
    }),
    [config, setModel, setFloors, setFinish, setInterior, setLighting, reset],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useElevatorConfig() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useElevatorConfig must be used inside <ElevatorConfigProvider>');
  return ctx;
}

/** Human-readable finish name for the current configuration. */
export const finishLabel = (config: ElevatorConfiguration) => {
  const finish = findFinish(config.exteriorColor);
  const family = config.texture === 'standard' ? '' : `${config.texture[0].toUpperCase()}${config.texture.slice(1)} `;
  return `${family}${finish.name}`.trim();
};
