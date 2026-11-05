import { chmodSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { buildComponentsCss, listComponentStyles } from '../src/css/components-css';
import { buildTailwindCss } from '../src/css/tailwind-css';
import { buildTokensCss } from '../src/css/tokens-css';

const fixtures = join(import.meta.dirname, 'fixtures');
let presetPath: string;

beforeAll(() => {
  const dir = mkdtempSync(join(tmpdir(), 'kore-design-'));
  writeFileSync(join(dir, 'tokens.css'), buildTokensCss());
  presetPath = join(dir, 'tailwind.css');
  writeFileSync(presetPath, buildTailwindCss());
});

describe('CSS dos componentes (decisão 131: @apply no CSS, classes semânticas no JSX)', () => {
  it('lista os CSS na ordem do Atomic: átomos e depois moléculas', () => {
    const files = listComponentStyles({ root: join(fixtures, 'components') });
    expect(files.map((file) => relative(fixtures, file))).toEqual([
      'components/atoms/sample-button/sample-button.css',
      'components/molecules/sample-field/sample-field.css',
    ]);
  });

  it('sem componentes, não gera CSS', async () => {
    expect(listComponentStyles({ root: join(fixtures, 'nao-existe') })).toEqual([]);
    await expect(buildComponentsCss({ files: [], presetPath })).resolves.toBe('');
  });

  it('resolve o @apply com o preset, na camada components, sem emitir o tema nem utilitárias', async () => {
    const css = await buildComponentsCss({
      files: listComponentStyles({ root: join(fixtures, 'components') }),
      presetPath,
    });
    expect(css).not.toContain('@apply');
    expect(css).toMatch(/@layer components \{/);
    expect(css).toMatch(/\.kore-sample-button \{[^}]*background-color: var\(--primary\)/);
    expect(css).toMatch(/\.kore-sample-button \{[^}]*font-family: var\(--kore-font-body\)/);
    expect(css).toMatch(/\.kore-sample-button \{[^}]*border-radius: var\(--kore-radius-md\)/);
    expect(css).toMatch(
      /\.kore-sample-button--secondary \{[^}]*background-color: var\(--secondary\)/,
    );
    expect(css).toContain('var(--kore-shadow-focus-ring)');
    expect(css).toMatch(
      /\.kore-sample-button--error \{[^}]*border-width: var\(--kore-border-1-5\)/,
    );
    expect(css).toContain('@media (width >= 48rem)');
    expect(css).toMatch(
      /\.kore-sample-button--site \{[^}]*background-color: var\(--site-primary\)/,
    );
    expect(css.indexOf('.kore-sample-button')).toBeLessThan(css.indexOf('.kore-sample-field'));
    // @reference não emite o tema, o preflight nem os tokens.
    expect(css).not.toContain('--kore-primary-dark:');
    expect(css).not.toMatch(/html,\s*:host/);
  });

  it('o CSS dos componentes do pacote compila dentro das regras', async () => {
    const files = listComponentStyles({
      root: join(import.meta.dirname, '..', 'src', 'components'),
    });
    expect(files.length).toBeGreaterThan(0);
    const css = await buildComponentsCss({ files, presetPath });
    expect(css).toMatch(/\.kore-button \{/);
    expect(css).toMatch(/\.kore-google-button \{/);
  });

  it('utilitária fora do DS quebra o build', async () => {
    await expect(
      buildComponentsCss({
        files: listComponentStyles({ root: join(fixtures, 'components-invalid/utility') }),
        presetPath,
      }),
    ).rejects.toThrow(/bg-red-500/);
  });

  it('valor ou variante arbitrária e variável fora do DS quebram o build', async () => {
    const build = buildComponentsCss({
      files: listComponentStyles({ root: join(fixtures, 'components-invalid/arbitrary') }),
      presetPath,
    });
    await expect(build).rejects.toThrow(/fora do DS/);
    await expect(build).rejects.toThrow(/@apply bg-\[#ff0000\]/);
  });

  it('declaração direta fora do DS quebra o build (decisão 133)', async () => {
    const build = buildComponentsCss({
      files: listComponentStyles({ root: join(fixtures, 'components-invalid/declaration') }),
      presetPath,
    });
    await expect(build).rejects.toThrow(/bad\.css:2: "color" tem utilitária/);
    await expect(build).rejects.toThrow(/"red": cor literal/);
  });

  it('@import e @theme no CSS de componente quebram o build', async () => {
    const build = buildComponentsCss({
      files: listComponentStyles({ root: join(fixtures, 'components-invalid/at-rule') }),
      presetPath,
    });
    await expect(build).rejects.toThrow(/bad\.css:1: "@import" não é aceita/);
    await expect(build).rejects.toThrow(/bad\.css:3: "@theme" não é aceita/);
  });

  it('CSS fora de atoms/ e molecules/ quebra o build', () => {
    expect(() =>
      listComponentStyles({ root: join(fixtures, 'components-invalid/outside') }),
    ).toThrow(/organisms/);
  });

  it.skipIf(process.getuid?.() === 0)('erro de leitura que não seja ENOENT não é engolido', () => {
    const root = mkdtempSync(join(tmpdir(), 'kore-design-'));
    const locked = join(root, 'atoms');
    mkdirSync(locked);
    chmodSync(locked, 0o000);
    try {
      expect(() => listComponentStyles({ root })).toThrow(/EACCES/);
    } finally {
      chmodSync(locked, 0o755);
    }
  });
});
