import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pageMeta } from '../data/content';
import { ScrollTrigger, prefersReducedMotion } from './useScrollAnimation';

/**
 * Per-route housekeeping: start each page at the top, refresh the scroll
 * triggers for the new layout, and set the document title and description.
 *
 * Titles live in src/data/content.ts so routes and copy stay in one place.
 */
export function useRouteChrome() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'instant' });

    const meta = pageMeta[pathname];
    if (meta) {
      document.title = meta.title;
      const tag = document.querySelector('meta[name="description"]');
      if (tag) tag.setAttribute('content', meta.description);
    }

    // The new page's sections are measured after paint, not before.
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 140);
    return () => window.clearTimeout(id);
  }, [pathname]);
}
