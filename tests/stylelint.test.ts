import stylelint from 'stylelint';
import { describe, expect, it } from 'vitest';
import plugins from '../stylelint/index.js';
import {
  findApplyViolations,
  findAtRuleViolation,
  findDeclarationViolation,
} from '../stylelint/rules.js';

describe('regras do CSS de componente (decisões 131 e 133)', () => {
  it('@apply: aponta cada candidato que contorna o DS', () => {
    expect(
      findApplyViolations({
        params: `bg-[#ff0000] text-[13px] rounded-[3px] font-[Comic_Sans] bg-(--other-color)
          [&>svg]:p-2 md:bg-[red] p-4 bg-primary md:px-6 bg-(--kore-primary-base) text-(--site-foreground)`,
      }),
    ).toEqual([
      'bg-[#ff0000]',
      'text-[13px]',
      'rounded-[3px]',
      'font-[Comic_Sans]',
      'bg-(--other-color)',
      '[&>svg]:p-2',
      'md:bg-[red]',
    ]);
  });

  it.each([
    ['-webkit-tap-highlight-color', 'transparent'],
    ['grid-area', 'header'],
    ['-webkit-appearance', 'none'],
    ['text-rendering', 'optimizeLegibility'],
    ['counter-reset', 'step'],
    ['-webkit-tap-highlight-color', 'var(--kore-primary-tint)'],
  ])('declaração direta aceita: %s: %s', (property, value) => {
    expect(findDeclarationViolation({ property, value })).toBeNull();
  });

  it.each([
    ['color', 'var(--kore-ink)', /tem utilitária/],
    ['padding', '3px', /tem utilitária/],
    ['--my-color', 'red', /tem utilitária/],
    ['-webkit-tap-highlight-color', '#ff0000', /só palavra-chave/],
    ['-webkit-tap-highlight-color', 'rgb(255 0 0)', /só palavra-chave/],
    ['-webkit-tap-highlight-color', 'red', /cor literal/],
    ['counter-reset', 'step 2', /só palavra-chave/],
    ['grid-area', '1rem', /só palavra-chave/],
    ['-webkit-tap-highlight-color', 'var(--other)', /só var\(--kore-\*\)/],
    ['-webkit-tap-highlight-color', 'var(--kore-ink, red)', /só palavra-chave/],
  ])('declaração direta recusada: %s: %s', (property, value, reason) => {
    expect(findDeclarationViolation({ property, value })).toMatch(reason);
  });
});

describe('at-rules no CSS de componente', () => {
  it.each(['apply', 'media', 'supports', 'container', 'keyframes'])('aceita @%s', (name) => {
    expect(findAtRuleViolation({ name })).toBeNull();
  });

  it.each([
    'import',
    'theme',
    'utility',
    'plugin',
    'config',
    'source',
    'tailwind',
    'layer',
    'reference',
    'font-face',
    'IMPORT',
    'APPLY',
    'Media',
  ])('recusa @%s', (name) => {
    expect(findAtRuleViolation({ name })).toMatch(/não é aceita/);
  });
});

describe('plugin do Stylelint', () => {
  const config = {
    plugins,
    rules: {
      'kore/apply-ds-only': true,
      'kore/declaration-ds-only': true,
      'kore/at-rule-ds-only': true,
    },
  };

  async function lint({ code }: { code: string }) {
    const { results } = await stylelint.lint({ code, config });
    return (results[0]?.warnings ?? [])
      .map(({ rule, line }) => ({ rule, line }))
      .sort((a, b) => a.line - b.line || a.rule.localeCompare(b.rule));
  }

  it('acusa @apply e declaração fora do DS, com a linha', async () => {
    expect(
      await lint({
        code: '.a {\n  @apply p-4 bg-[#f00];\n  color: #f00;\n}\n',
      }),
    ).toEqual([
      { rule: 'kore/apply-ds-only', line: 2 },
      { rule: 'kore/declaration-ds-only', line: 3 },
    ]);
  });

  it('acusa @import e @theme, que trariam CSS de fora do DS', async () => {
    expect(
      await lint({
        code: "@import './outro.css';\n@theme {\n  --color-x: red;\n}\n.a {\n  @apply p-4;\n}\n",
      }),
    ).toEqual([
      { rule: 'kore/at-rule-ds-only', line: 1 },
      { rule: 'kore/at-rule-ds-only', line: 2 },
      { rule: 'kore/declaration-ds-only', line: 3 },
    ]);
  });

  it('aceita CSS de componente dentro do DS', async () => {
    expect(
      await lint({
        code: '.a {\n  @apply p-4 bg-primary md:px-6;\n  -webkit-tap-highlight-color: transparent;\n  @media (hover: hover) {\n    @apply bg-primary-hover;\n  }\n}\n',
      }),
    ).toEqual([]);
  });
});
