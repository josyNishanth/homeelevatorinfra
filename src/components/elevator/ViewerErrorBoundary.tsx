import { Component } from 'react';
import type { ReactNode } from 'react';

type Props = { children: ReactNode; fallback: ReactNode };

/**
 * Swaps the 3D viewer for a 2D fallback if WebGL is unavailable or the GLB fails
 * to load. Deliberately kept in its own module with no three.js imports, so
 * ElevatorViewer can reference it without pulling the 3D bundle into every page.
 */
export default class ViewerErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error('[ElevatorViewer] 3D viewer failed; showing the image viewer instead:', error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
