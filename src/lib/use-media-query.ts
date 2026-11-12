import { useSyncExternalStore } from 'react';

/**
 * Acompanha uma media query. Sem `matchMedia` (testes, servidor), vale `fallback`.
 */
export function useMediaQuery({ query, fallback }: { query: string; fallback: boolean }) {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === 'undefined' || !window.matchMedia) return () => {};
      const media = window.matchMedia(query);
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    },
    () =>
      typeof window === 'undefined' || !window.matchMedia
        ? fallback
        : window.matchMedia(query).matches,
    () => fallback,
  );
}
