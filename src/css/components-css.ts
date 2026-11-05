import { readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, relative, sep } from 'node:path';
import { compile } from '@tailwindcss/node';

/** Ordem do Atomic leve (ADR): as moléculas vêm depois dos átomos e podem sobrescrevê-los. */
const ATOMIC_LEVELS = ['atoms', 'molecules'] as const;

function listCssFiles({ dir }: { dir: string }): string[] {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
  return entries
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return listCssFiles({ dir: path });
      return entry.name.endsWith('.css') ? [path] : [];
    });
}

/**
 * Lista os `.css` de componente em `<root>/<nível>/<componente>/*.css`, na ordem do
 * Atomic. Um `.css` fora de `atoms/` e `molecules/` quebra o build, para não ser
 * ignorado em silêncio.
 */
export function listComponentStyles({ root }: { root: string }): string[] {
  const outside = listCssFiles({ dir: root }).filter(
    (file) => !ATOMIC_LEVELS.some((level) => relative(root, file).startsWith(`${level}${sep}`)),
  );
  if (outside.length > 0) {
    throw new Error(
      `CSS de componente fora de ${ATOMIC_LEVELS.join('/ e ')}/: ${outside.map((file) => relative(root, file)).join(', ')}`,
    );
  }
  return ATOMIC_LEVELS.flatMap((level) => listCssFiles({ dir: join(root, level) }));
}

/** Só variáveis do DS valem como valor entre parênteses: `bg-(--kore-primary-base)`. */
const DS_VARIABLE = /^--(kore|site)-[\w-]+$/;

/**
 * Recusa no `@apply` o que contorna o DS: valor ou variante arbitrária (`bg-[#f00]`,
 * `text-[13px]`, `[&>svg]:…`) e variável que não seja `--kore-*` ou `--site-*`.
 */
export function findApplyViolations({ css }: { css: string }): string[] {
  const violations: string[] = [];
  for (const [, list = ''] of css.matchAll(/@apply\s+([^;}]+)/g)) {
    for (const candidate of list.trim().split(/\s+/)) {
      if (candidate.includes('[')) {
        violations.push(candidate);
        continue;
      }
      const variables = [...candidate.matchAll(/\(([^)]*)\)/g)].map(([, inner = '']) => inner);
      if (variables.some((variable) => !DS_VARIABLE.test(variable))) violations.push(candidate);
    }
  }
  return violations;
}

/**
 * Compila o CSS dos componentes (decisão 131): os arquivos usam só `@apply` com as
 * utilitárias do preset; o build faz o `@reference` ao Tailwind e ao preset, então a
 * saída é CSS puro, sem `@apply`, lendo as variáveis do `tokens.css`. Quebram o build:
 * utilitária fora do DS (ex.: `bg-red-500`), valor arbitrário e variável fora do DS.
 */
export async function buildComponentsCss({
  files,
  presetPath,
}: {
  files: string[];
  presetPath: string;
}): Promise<string> {
  if (files.length === 0) return '';

  const violations = files.flatMap((file) =>
    findApplyViolations({ css: readFileSync(file, 'utf8') }).map(
      (candidate) => `${file}: ${candidate}`,
    ),
  );
  if (violations.length > 0) {
    throw new Error(`@apply fora do DS (decisão 131):\n${violations.join('\n')}`);
  }

  const require = createRequire(import.meta.url);
  const tailwindCss = join(dirname(require.resolve('tailwindcss/package.json')), 'index.css');
  const base = dirname(presetPath);
  const entry = [
    `@reference '${tailwindCss}';`,
    `@reference '${presetPath}';`,
    ...files.map((file) => `@import './${relative(base, file)}' layer(components);`),
  ].join('\n');
  const compiler = await compile(entry, { base, onDependency: () => undefined });
  return compiler.build([]);
}
