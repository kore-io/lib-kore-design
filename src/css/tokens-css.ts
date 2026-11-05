import { coreColors } from '../tokens/core';
import {
  formatShadow,
  motion,
  motionDistance,
  motionEasing,
  radius,
  shadows,
  spacing,
} from '../tokens/layout';
import { overlayColor, semanticColorRefs } from '../tokens/semantic';
import {
  siteBackgrounds,
  siteColors,
  siteDataAttributes,
  siteDefaults,
  siteFonts,
} from '../tokens/site';
import { fontFamilies, fontWeights, typeStyles } from '../tokens/typography';
import { DESIGN_SYSTEM_VERSION } from '../tokens';

type Declarations = Record<string, string | number>;

export function pxToRem({ px }: { px: number }): string {
  return `${Number((px / 16).toFixed(4))}rem`;
}

export function toKebab({ name }: { name: string }): string {
  return name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

export function fontStack({ families }: { families: readonly string[] }): string {
  const generic = new Set(['serif', 'sans-serif', 'system-ui', 'monospace']);
  return families.map((family) => (generic.has(family) ? family : `'${family}'`)).join(', ');
}

/** Achata `{ primary: { base: '#…' } }` em `{ 'primary-base': '#…' }`. */
export function flatten({
  tree,
  prefix = '',
}: {
  tree: object;
  prefix?: string;
}): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(tree)) {
    const name = prefix ? `${prefix}-${key}` : key;
    if (typeof value === 'object' && value !== null) {
      Object.assign(out, flatten({ tree: value, prefix: name }));
    } else {
      out[name] = String(value);
    }
  }
  return out;
}

function block({ selector, declarations }: { selector: string; declarations: Declarations }) {
  const body = Object.entries(declarations)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n');
  return `${selector} {\n${body}\n}`;
}

export function coreDeclarations(): Declarations {
  const out: Declarations = {};
  for (const [name, value] of Object.entries(flatten({ tree: coreColors }))) {
    out[`--kore-${name}`] = value;
  }
  for (const [name, families] of Object.entries(fontFamilies)) {
    out[`--kore-font-${name}`] = fontStack({ families });
  }
  for (const [name, weight] of Object.entries(fontWeights)) {
    out[`--kore-weight-${name}`] = weight;
  }
  for (const [name, style] of Object.entries(typeStyles)) {
    out[`--kore-size-${name}`] = pxToRem({ px: style.fontSize });
    out[`--kore-leading-${name}`] = style.lineHeight;
  }
  for (const [step, px] of Object.entries(spacing)) {
    out[`--kore-space-${step}`] = pxToRem({ px });
  }
  for (const [name, px] of Object.entries(radius)) {
    out[`--kore-radius-${name}`] = `${px}px`;
  }
  for (const [name, shadow] of Object.entries(shadows)) {
    out[`--kore-shadow-${name}`] = formatShadow({ shadow });
  }
  for (const [name, ms] of Object.entries(motion)) {
    out[`--kore-motion-${name}`] = `${ms}ms`;
  }
  out['--kore-motion-distance'] = `${motionDistance}px`;
  out['--kore-ease'] = motionEasing;
  return out;
}

export function semanticDeclarations(): Declarations {
  const out: Declarations = {};
  for (const [name, path] of Object.entries(semanticColorRefs)) {
    out[`--${name}`] = `var(--kore-${path.replace('.', '-')})`;
  }
  out['--overlay'] = overlayColor;
  return out;
}

function siteFontsDeclarations({ name }: { name: keyof typeof siteFonts }): Declarations {
  const { display, body } = siteFonts[name];
  return {
    '--site-font-display': fontStack({ families: [display, 'serif'] }),
    '--site-font-body': fontStack({ families: [body, 'sans-serif'] }),
  };
}

function prefixedDeclarations({ values }: { values: Record<string, string> }): Declarations {
  const out: Declarations = {};
  for (const [key, value] of Object.entries(values)) {
    if (key === 'label') continue;
    out[`--site-${toKebab({ name: key })}`] = value;
  }
  return out;
}

/** CSS com as variáveis dos tokens, sem depender do Tailwind. */
export function buildTokensCss(): string {
  const parts: string[] = [
    `/* @kore-io/design — tokens do ${DESIGN_SYSTEM_VERSION} (gerado; não edite). */`,
    block({
      selector: ':root',
      declarations: {
        ...coreDeclarations(),
        ...semanticDeclarations(),
        ...siteFontsDeclarations({ name: siteDefaults.fonts }),
        ...prefixedDeclarations({ values: siteColors[siteDefaults.colors] }),
        ...prefixedDeclarations({ values: siteBackgrounds[siteDefaults.background] }),
      },
    }),
  ];

  for (const name of Object.keys(siteFonts) as (keyof typeof siteFonts)[]) {
    parts.push(
      block({
        selector: `[${siteDataAttributes.fonts}='${name}']`,
        declarations: siteFontsDeclarations({ name }),
      }),
    );
  }
  for (const [name, values] of Object.entries(siteColors)) {
    parts.push(
      block({
        selector: `[${siteDataAttributes.colors}='${name}']`,
        declarations: prefixedDeclarations({ values }),
      }),
    );
  }
  for (const [name, values] of Object.entries(siteBackgrounds)) {
    parts.push(
      block({
        selector: `[${siteDataAttributes.background}='${name}']`,
        declarations: prefixedDeclarations({ values }),
      }),
    );
  }
  return `${parts.join('\n\n')}\n`;
}
