import { ContactShadows, Environment, Lightformer } from '@react-three/drei';

type Props = {
  /** World Y the model sits on, so the contact shadow lands under it. */
  groundY?: number;
  /** Largest horizontal dimension of the model, used to size the shadow plane. */
  footprint?: number;
  /** Model height, used to fade the shadow out with distance. */
  height?: number;
};

/**
 * Studio lighting rig: a soft key from the front-left, a gentle fill opposite it,
 * a cool rim from behind, and a procedural softbox environment for reflections.
 *
 * The environment is built from Lightformers rather than an HDRI file — it needs
 * no network request and no asset, which keeps the viewer self-contained. It is
 * rendered once (`frames={1}`) since nothing in it moves.
 */
export default function ElevatorLighting({ groundY = 0, footprint = 1.2, height = 5.5 }: Props) {
  return (
    <>
      {/* The GLB's " frame color" material has no baseColorFactor, so it is pure
          white. Total light is kept deliberately low — overlighting a white
          object clips every channel to 1.0 and the form disappears. */}
      <ambientLight intensity={0.26} />

      {/* Key — the light that defines the form. Kept soft and high. */}
      <directionalLight position={[footprint * 4, height * 1.5, footprint * 5]} intensity={1.4} color="#ffffff" />

      {/* Fill — lifts the shadow side so nothing reads as black. */}
      <directionalLight position={[-footprint * 5, height * 0.6, footprint * 3]} intensity={0.38} color="#eef2f7" />

      {/* Rim — separates the frame from the background. */}
      <directionalLight position={[-footprint * 2, height * 1.1, -footprint * 5]} intensity={0.85} color="#cfe0f5" />

      {/* Reflections. background={false} keeps it out of frame — it only lights. */}
      <Environment resolution={256} frames={1} background={false}>
        <Lightformer form="rect" intensity={2} position={[0, height * 1.4, height * 0.5]} scale={[8, 8, 1]} />
        <Lightformer form="rect" intensity={0.7} position={[-height, height * 0.6, 0]} scale={[4, 10, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={0.95} position={[height, height * 0.6, 0]} scale={[4, 10, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="rect" intensity={0.5} position={[0, height * 0.3, -height]} scale={[8, 8, 1]} rotation-y={Math.PI} />
      </Environment>

      {/* Soft ground contact instead of shadow maps: no harsh edges, cheaper. */}
      <ContactShadows
        position={[0, groundY + 0.002, 0]}
        scale={Math.max(footprint * 5, 6)}
        resolution={1024}
        far={height * 0.4}
        blur={2.8}
        opacity={0.42}
        color="#2b2f36"
      />
    </>
  );
}
