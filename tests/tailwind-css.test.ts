import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { compile } from '@tailwindcss/node';
import { beforeAll, describe, expect, it } from 'vitest';
import { buildTailwindCss } from '../src/css/tailwind-css';
import { buildTokensCss } from '../src/css/tokens-css';

const require = createRequire(import.meta.url);

/** Compila o preset como o app faria e gera o CSS das classes pedidas. */
let generate: (candidates: string[]) => string;

beforeAll(async () => {
  const dir = mkdtempSync(join(tmpdir(), 'kore-design-'));
  writeFileSync(join(dir, 'tokens.css'), buildTokensCss());
  writeFileSync(join(dir, 'tailwind.css'), buildTailwindCss());
  const tailwindDir = join(require.resolve('tailwindcss/package.json'), '..');
  const compiler = await compile(
    // Igual ao app: `@import 'tailwindcss'` (com o preflight) e depois o preset.
    `@import '${join(tailwindDir, 'index.css')}';\n@import './tailwind.css';`,
    { base: dir, onDependency: () => undefined },
  );
  generate = (candidates) => compiler.build(candidates);
});

describe('preset do Tailwind v4 (tailwind.css)', () => {
  it('cores semânticas, do core e do site leem as variáveis do tokens.css', () => {
    const css = generate([
      'bg-primary',
      'text-primary-foreground',
      'hover:bg-primary-hover',
      'border-border',
      'ring-ring',
      'bg-success-tint',
      'text-danger-text',
      'bg-site-primary',
      'bg-overlay',
    ]);
    expect(css).toContain('background-color: var(--primary)');
    expect(css).toContain('color: var(--primary-foreground)');
    expect(css).toContain('background-color: var(--primary-hover)');
    expect(css).toContain('border-color: var(--border)');
    expect(css).toContain('background-color: var(--kore-success-tint)');
    expect(css).toContain('color: var(--kore-danger-text)');
    expect(css).toContain('background-color: var(--site-primary)');
    expect(css).toContain('background-color: var(--overlay)');
  });

  it('remove as cores, fontes, textos, raios e sombras padrão do Tailwind', () => {
    const css = generate([
      'bg-red-500',
      'text-sm',
      'rounded-2xl',
      'shadow-2xl',
      'font-sans',
      'bg-black',
    ]);
    expect(css).not.toMatch(
      /\.bg-red-500|\.text-sm|\.rounded-2xl|\.shadow-2xl|\.font-sans|\.bg-black/,
    );
  });

  it('estilos de texto: text-* com altura de linha e peso; type-* com a família', () => {
    const css = generate(['text-display-xl', 'type-overline', 'type-link', 'font-display']);
    expect(css).toMatch(/\.text-display-xl \{\s*font-size: var\(--kore-size-display-xl\);/);
    expect(css).toMatch(
      /\.text-display-xl \{[^}]*line-height: var\(--tw-leading, var\(--kore-leading-display-xl\)\)/,
    );
    expect(css).toMatch(
      /\.text-display-xl \{[^}]*font-weight: var\(--tw-font-weight, var\(--kore-weight-semibold\)\)/,
    );
    expect(css).toMatch(/\.type-overline \{[^}]*text-transform: uppercase/);
    expect(css).toMatch(/\.type-overline \{[^}]*letter-spacing: 0\.08em/);
    expect(css).toMatch(/\.type-link \{[^}]*text-decoration-line: underline/);
    expect(css).toContain('font-family: var(--kore-font-display)');
  });

  it('espaçamento na base 4, raios, sombras e movimento do DS', () => {
    const css = generate([
      'p-4',
      'gap-6',
      'rounded-md',
      'rounded-full',
      'shadow-md',
      'shadow-focus-ring',
      'transition',
      'ease-kore',
    ]);
    expect(css).toContain('--spacing: 0.25rem');
    expect(css).toContain('border-radius: var(--kore-radius-md)');
    expect(css).toMatch(/\.rounded-full \{/);
    expect(css).toContain('var(--kore-shadow-md)');
    expect(css).toContain('var(--kore-shadow-focus-ring)');
    expect(css).toContain('var(--kore-motion-base)');
    expect(css).toContain('transition-timing-function: var(--kore-ease)');
  });

  it('o preflight usa a fonte do corpo (Nunito Sans) no html', () => {
    const css = generate([]);
    expect(css).toMatch(/html,\s*:host \{[^}]*font-family: var\(--kore-font-body[,)]/);
    expect(css).toContain("--kore-font-body: 'Nunito Sans', system-ui, sans-serif;");
  });

  it('só os breakpoints do Brand Kit: md (768 px) e lg (1024 px)', () => {
    const css = generate(['sm:p-4', 'md:p-4', 'lg:p-4', 'xl:p-4', '2xl:p-4']);
    expect(css).toContain('@media (width >= 48rem)');
    expect(css).toContain('@media (width >= 64rem)');
    expect(css).not.toMatch(/40rem|80rem|96rem/);
  });
});
