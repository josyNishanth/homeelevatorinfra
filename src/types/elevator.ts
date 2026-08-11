/**
 * Configuration state for the elevator the visitor is building.
 *
 * This state is deliberately independent of how the elevator is *drawn*.
 * Today <ElevatorViewer mode="image" /> resolves it to a pre-rendered image;
 * later the same object drives a React Three Fiber scene (see
 * src/components/elevator/ElevatorMaterials.ts, which is the only place that
 * translates configuration into visual properties).
 */
export type ElevatorModel = 'vacuum' | 'hydraulic' | 'cylindrical';

export type FloorsKey = 'G+1' | 'G+2' | 'G+3';

/** Finish family — matches the swatch groups in the personalisation panel. */
export type FinishFamily = 'standard' | 'textured' | 'metallic';

export type ElevatorConfiguration = {
  model: ElevatorModel;
  floors: FloorsKey;
  /** Finish id, e.g. 'black' — see src/data/colors.ts */
  exteriorColor: string;
  /** Finish family of the selected exterior finish, e.g. 'metallic'. */
  texture: FinishFamily;
  /** Interior id, e.g. 'marble' */
  interior: string;
  /** Lighting id, e.g. 'premium' */
  lighting: string;
};

export type ViewerMode = 'image' | '3d';
