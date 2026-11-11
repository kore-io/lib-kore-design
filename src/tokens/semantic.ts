import { coreColors } from './core';

/**
 * Conjunto `Kore/Semantic` (DS v0.18). Os nomes seguem a convenção do shadcn/ui,
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
  /**
   * Texto de placeholder precisa de 4,5:1 (WCAG 1.4.3, decisão 132), e `gray.700`
   * é o cinza mais claro da escala que passa no campo branco.
   */
  placeholder: 'gray.700',
} as const;

/** `color.overlay`: Tinta com 40% (decisão 98), fundo de modal e drawer. */
export const overlayColor = 'rgba(36, 26, 30, 0.4)';

/**
 * Cores de tag (`color.tag.<cor>.tint|text` no `Kore/Semantic`, DS v0.18; decisões 191 e
 * 192(4)): pílula com fundo suave (`tint`) e texto da mesma família (`text`). Os nomes
 * são o enum da API; sem cor (`null`) é o padrão e não tem token.
 */
export const tagColorRefs = {
  wine: { tint: 'primary.tint', text: 'primary.dark' },
  champagne: { tint: 'accent.base', text: 'ink' },
  green: { tint: 'success.tint', text: 'success.text' },
  amber: { tint: 'warning.tint', text: 'warning.text' },
  red: { tint: 'danger.tint', text: 'danger.text' },
  blue: { tint: 'info.tint', text: 'info.text' },
} as const satisfies Record<string, { tint: string; text: string }>;

export type TagColorName = keyof typeof tagColorRefs;

/** Os nomes das cores de tag, na ordem do DS (o enum da API). */
export const tagColorNames = Object.keys(tagColorRefs) as TagColorName[];

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

/** Cores de tag resolvidas (hex), para uso em JS. */
export const tagColors = Object.fromEntries(
  Object.entries(tagColorRefs).map(([name, { tint, text }]) => [
    name,
    { tint: resolveCoreColor({ path: tint }), text: resolveCoreColor({ path: text }) },
  ]),
) as Record<TagColorName, { tint: string; text: string }>;
