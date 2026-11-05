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

/**
 * Bordas fracionárias dos componentes do DS (decisão 140), px. O Penpot usa 1,5 px
 * no erro dos campos e nos controles desmarcados (Radio, Checkbox); a escala do
 * Tailwind só tem inteiros, então o preset cria `border-1.5`.
 */
export const fractionalBorderWidths = [1.5] as const;

/** ms */
export const motion = {
  fast: 120,
  base: 200,
  slow: 320,
} as const;

/** px; deslocamento das animações de entrada (`motion.distance`). */
export const motionDistance = 8;

/**
 * Quadros-chave das animações do DS (02 · Motion). O drawer entra da esquerda e o fundo
 * escurece por opacidade junto; com movimento reduzido, só a opacidade muda.
 */
export const motionKeyframes = {
  'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
  'fade-out': { from: { opacity: '1' }, to: { opacity: '0' } },
  'slide-in-left': { from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(0)' } },
  'slide-out-left': {
    from: { transform: 'translateX(0)' },
    to: { transform: 'translateX(-100%)' },
  },
} as const;

/**
 * Animações prontas para o preset (`animate-<nome>`). Entrar usa a duração do
 * componente; sair, "o mesmo, ao contrário, com a duração um passo abaixo". O
 * movimento reduzido usa só opacidade em motion.base.
 */
export const motionAnimations = {
  'drawer-in': { keyframes: 'slide-in-left', duration: 'slow' },
  'drawer-out': { keyframes: 'slide-out-left', duration: 'base' },
  'overlay-in': { keyframes: 'fade-in', duration: 'slow' },
  'overlay-out': { keyframes: 'fade-out', duration: 'base' },
  'reduced-in': { keyframes: 'fade-in', duration: 'base' },
  'reduced-out': { keyframes: 'fade-out', duration: 'base' },
} as const satisfies Record<
  string,
  { keyframes: keyof typeof motionKeyframes; duration: keyof typeof motion }
>;

/** Curva do Brand Kit (Movimento). */
export const motionEasing = 'cubic-bezier(0.2, 0.8, 0.2, 1)';

/** Breakpoints do Brand Kit (os padrões do Tailwind), px. */
export const breakpoints = {
  md: 768,
  lg: 1024,
} as const;
