import { coreColors } from '../tokens/core';
import {
  breakpoints,
  fractionalBorderWidths,
  motionAnimations,
  motionKeyframes,
  radius,
  shadows,
} from '../tokens/layout';
import { semanticColorRefs } from '../tokens/semantic';
import { siteBackgrounds, siteColors, siteDefaults } from '../tokens/site';
import { typeStyles } from '../tokens/typography';
import { DESIGN_SYSTEM_VERSION } from '../tokens';
import { borderWidthName, flatten, pxToRem, toKebab } from './tokens-css';

type Declarations = Record<string, string>;

function block({ selector, declarations }: { selector: string; declarations: Declarations }) {
  const body = Object.entries(declarations)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n');
  return `${selector} {\n${body}\n}`;
}

/** Variáveis do `@theme inline`: as utilitárias leem as variáveis do `tokens.css` em tempo de execução. */
export function themeDeclarations(): Declarations {
  const out: Declarations = {};

  for (const name of Object.keys(semanticColorRefs)) {
    out[`--color-${name}`] = `var(--${name})`;
  }
  out['--color-overlay'] = 'var(--overlay)';
  for (const name of Object.keys(flatten({ tree: coreColors }))) {
    out[`--color-${name}`] = `var(--kore-${name})`;
  }
  const siteKeys = new Set([
    ...Object.keys(siteColors[siteDefaults.colors]),
    ...Object.keys(siteBackgrounds[siteDefaults.background]),
  ]);
  siteKeys.delete('label');
  for (const key of siteKeys) {
    const name = toKebab({ name: key });
    out[`--color-site-${name}`] = `var(--site-${name})`;
  }

  out['--font-display'] = 'var(--kore-font-display)';
  out['--font-body'] = 'var(--kore-font-body)';
  out['--font-site-display'] = 'var(--site-font-display)';
  out['--font-site-body'] = 'var(--site-font-body)';
  // Com `--font-*` zerado, o preflight do `html` cairia na fonte do sistema.
  out['--default-font-family'] = 'var(--kore-font-body)';

  for (const [name, style] of Object.entries(typeStyles)) {
    out[`--text-${name}`] = `var(--kore-size-${name})`;
    out[`--text-${name}--line-height`] = `var(--kore-leading-${name})`;
    out[`--text-${name}--font-weight`] = `var(--kore-weight-${style.fontWeight})`;
    if (style.letterSpacing !== 0) {
      out[`--text-${name}--letter-spacing`] = `${style.letterSpacing}em`;
    }
  }

  for (const name of Object.keys(radius)) {
    if (name === 'full') continue; // `rounded-full` já existe no Tailwind
    out[`--radius-${name}`] = `var(--kore-radius-${name})`;
  }
  for (const name of Object.keys(shadows)) {
    out[`--shadow-${name}`] = `var(--kore-shadow-${name})`;
  }

  out['--ease-kore'] = 'var(--kore-ease)';
  out['--default-transition-duration'] = 'var(--kore-motion-base)';
  out['--default-transition-timing-function'] = 'var(--kore-ease)';
  return out;
}

/** Uma utilitária `type-<estilo>` por estilo de texto, com a família e os demais atributos. */
export function typeUtilities(): string[] {
  return Object.entries(typeStyles).map(([name, style]) => {
    const declarations: Declarations = {
      'font-family': `var(--kore-font-${style.fontFamily})`,
      'font-size': `var(--kore-size-${name})`,
      'line-height': `var(--kore-leading-${name})`,
      'font-weight': `var(--kore-weight-${style.fontWeight})`,
      'letter-spacing': style.letterSpacing === 0 ? '0' : `${style.letterSpacing}em`,
    };
    if ('textTransform' in style) declarations['text-transform'] = style.textTransform;
    if ('textDecoration' in style) declarations['text-decoration-line'] = style.textDecoration;
    return block({ selector: `@utility type-${name}`, declarations });
  });
}

/** `border-1.5` (decisão 140): borda do DS que a escala inteira do Tailwind não tem. */
export function borderUtilities(): string[] {
  return fractionalBorderWidths.map((px) =>
    block({
      selector: `@utility border-${px}`,
      declarations: {
        'border-style': 'var(--tw-border-style)',
        'border-width': `var(--kore-border-${borderWidthName({ px })})`,
      },
    }),
  );
}

/** Animações do DS (`animate-drawer-in`…) e os quadros-chave, num `@theme` próprio. */
export function motionTheme(): string {
  const animations = Object.entries(motionAnimations).map(
    ([name, { keyframes, duration }]) =>
      `  --animate-${name}: kore-${keyframes} var(--kore-motion-${duration}) var(--kore-ease) both;`,
  );
  const keyframes = Object.entries(motionKeyframes).map(([name, { from, to }]) => {
    const frame = (label: string, declarations: Record<string, string>) =>
      `    ${label} {\n${Object.entries(declarations)
        .map(([property, value]) => `      ${property}: ${value};`)
        .join('\n')}\n    }`;
    return `  @keyframes kore-${name} {\n${frame('from', from)}\n${frame('to', to)}\n  }`;
  });
  return `@theme {\n${[...animations, ...keyframes].join('\n')}\n}`;
}

/**
 * Preset do Tailwind v4 (CSS). Uso no app:
 *   @import 'tailwindcss';
 *   @import '@kore-io/design/tailwind.css';
 */
export function buildTailwindCss(): string {
  return `${[
    `/* @kore-io/design — preset do Tailwind v4, ${DESIGN_SYSTEM_VERSION} (gerado; não edite). */`,
    "@import './tokens.css';",
    // Só valores do Brand Kit: zera as escalas padrão do Tailwind que o DS substitui.
    // O espaçamento fica aberto (múltiplos de 4) porque w-*, h-* e size-* usam a
    // mesma escala, e o alvo de toque de 44 px (`h-11`) não é um passo do DS.
    block({
      selector: '@theme',
      declarations: {
        '--color-*': 'initial',
        '--font-*': 'initial',
        '--text-*': 'initial',
        '--radius-*': 'initial',
        '--shadow-*': 'initial',
        '--breakpoint-*': 'initial',
        ...Object.fromEntries(
          Object.entries(breakpoints).map(([name, px]) => [
            `--breakpoint-${name}`,
            pxToRem({ px }),
          ]),
        ),
        '--spacing': pxToRem({ px: 4 }),
      },
    }),
    block({ selector: '@theme inline', declarations: themeDeclarations() }),
    motionTheme(),
    ...typeUtilities(),
    ...borderUtilities(),
  ].join('\n\n')}\n`;
}
