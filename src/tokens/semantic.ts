import { coreColors } from './core';

/**
 * Conjunto `Kore/Semantic` (DS v0.16). Os nomes seguem a convenção do shadcn/ui,
 * que é a mesma usada no Penpot, para os componentes Radix/shadcn usarem direto.
 * Cada valor é uma referência a um token do core, como no Penpot (`{color.paper}`).
 */
export const semanticColorRefs = {
  background: 'paper',
  foreground: 'ink',
  card: 'white',
  'card-foreground': 'ink',
  primary: 'primary.dark',
  'primary-foreground': 'paper',
  'primary-hover': 'primary.darker',
  secondary: 'gray.100',
  'secondary-foreground': 'ink',
  muted: 'gray.100',
  'muted-foreground': 'gray.700',
  accent: 'primary.tint',
  'accent-foreground': 'primary.dark',
  highlight: 'accent.base',
  'highlight-foreground': 'ink',
  destructive: 'danger.text',
  'destructive-foreground': 'paper',
  'destructive-hover': 'danger.darker',
  border: 'gray.300',
  input: 'gray.600',
  ring: 'primary.base',
  placeholder: 'gray.500',
} as const;

/** `color.overlay`: Tinta com 40% (decisão 98), fundo de modal e drawer. */
export const overlayColor = 'rgba(36, 26, 30, 0.4)';

export type SemanticColorName = keyof typeof semanticColorRefs | 'overlay';

export function resolveCoreColor({ path }: { path: string }): string {
  const value = path
    .split('.')
    .reduce<unknown>((node, key) => (node as Record<string, unknown>)[key], coreColors);
  if (typeof value !== 'string') throw new Error(`Token de cor inexistente: ${path}`);
  return value;
}

/** Valores resolvidos (hex), para uso em JS. */
export const semanticColors = {
  ...(Object.fromEntries(
    Object.entries(semanticColorRefs).map(([name, path]) => [name, resolveCoreColor({ path })]),
  ) as Record<keyof typeof semanticColorRefs, string>),
  overlay: overlayColor,
} satisfies Record<SemanticColorName, string>;
