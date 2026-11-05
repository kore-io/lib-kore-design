import { coreColors } from './core';

/** Conjuntos `Kore/Spacing`, `Kore/Radius`, `Kore/Shadow` e `Kore/Motion` (DS v0.16). */

/** px; base 4, a mesma escala do Tailwind (`p-4` = `space.4` = 16 px). */
export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

/** px */
export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export interface Shadow {
  /** px */
  offsetX: number;
  /** px */
  offsetY: number;
  /** px */
  blur: number;
  /** px */
  spread: number;
  color: string;
}

/** A sombra usa a Tinta (`color.ink`), não preto puro. */
export const shadows = {
  sm: { offsetX: 0, offsetY: 1, blur: 2, spread: 0, color: 'rgba(36, 26, 30, 0.06)' },
  md: { offsetX: 0, offsetY: 4, blur: 12, spread: 0, color: 'rgba(36, 26, 30, 0.08)' },
  lg: { offsetX: 0, offsetY: 12, blur: 32, spread: 0, color: 'rgba(36, 26, 30, 0.12)' },
  /** `focus-ring`: 5 px em `color.primary.base` (Vinho). */
  'focus-ring': { offsetX: 0, offsetY: 0, blur: 0, spread: 5, color: coreColors.primary.base },
} as const satisfies Record<string, Shadow>;

export function formatShadow({ shadow }: { shadow: Shadow }): string {
  const px = (value: number) => (value === 0 ? '0' : `${value}px`);
  const { offsetX, offsetY, blur, spread, color } = shadow;
  return `${px(offsetX)} ${px(offsetY)} ${px(blur)} ${px(spread)} ${color}`;
}

/** ms */
export const motion = {
  fast: 120,
  base: 200,
  slow: 320,
} as const;

/** px; deslocamento das animações de entrada (`motion.distance`). */
export const motionDistance = 8;

/** Curva do Brand Kit (Movimento). */
export const motionEasing = 'cubic-bezier(0.2, 0.8, 0.2, 1)';

/** Breakpoints do Brand Kit (os padrões do Tailwind), px. */
export const breakpoints = {
  md: 768,
  lg: 1024,
} as const;
