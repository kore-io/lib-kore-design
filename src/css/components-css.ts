import { readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, relative, sep } from 'node:path';
import { compile } from '@tailwindcss/node';
import postcss from 'postcss';
import {
  findApplyViolations,
  findAtRuleViolation,
  findDeclarationViolation,
} from '../../stylelint/rules.js';

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

/**
 * As mesmas regras do plugin do Stylelint (decisões 131 e 133), checadas no build:
 * só as at-rules da lista, `@apply` sem valor arbitrário nem variável fora do DS, e
 * declaração direta só para propriedade sem utilitária equivalente, com palavra-chave
 * ou variável do DS.
 */
export function findCssViolations({ css, file }: { css: string; file: string }): string[] {
  const violations: string[] = [];
  const root = postcss.parse(css, { from: file });
  root.walkAtRules((atRule) => {
    const line = `${file}:${atRule.source?.start?.line}`;
    const reason = findAtRuleViolation({ name: atRule.name });
    if (reason) violations.push(`${line}: ${reason}`);
    if (atRule.name !== 'apply') return;
    for (const candidate of findApplyViolations({ params: atRule.params })) {
      violations.push(`${line}: @apply ${candidate}`);
    }
  });
  root.walkDecls((declaration) => {
    const reason = findDeclarationViolation({
      property: declaration.prop,
      value: declaration.value,
    });
    if (reason) violations.push(`${file}:${declaration.source?.start?.line}: ${reason}`);
  });
  return violations;
}

/**
 * Compila o CSS dos componentes (decisão 131): os arquivos usam só `@apply` com as
 * utilitárias do preset; o build faz o `@reference` ao Tailwind e ao preset, então a
 * saída é CSS puro, sem `@apply`, lendo as variáveis do `tokens.css`. Quebram o build:
 * utilitária fora do DS (ex.: `bg-red-500`) e o que `findCssViolations` recusa.
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
    findCssViolations({ css: readFileSync(file, 'utf8'), file }),
  );
  if (violations.length > 0) {
    throw new Error(`CSS de componente fora do DS (decisões 131 e 133):\n${violations.join('\n')}`);
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
