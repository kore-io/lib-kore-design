import axe from 'axe-core';

/**
 * Roda o axe-core no elemento e falha com a lista das violações. A regra de
 * contraste fica de fora: o jsdom não calcula estilo, e o contraste dos tokens
 * é coberto em tests/contrast.test.ts.
 */
export async function expectNoA11yViolations({
  container,
  disabledRules = [],
}: {
  container: Element;
  /** Regras desligadas com motivo no teste (ex.: `region` para conteúdo em portal). */
  disabledRules?: string[];
}) {
  const rules: Record<string, { enabled: boolean }> = { 'color-contrast': { enabled: false } };
  for (const rule of disabledRules) rules[rule] = { enabled: false };
  const { violations } = await axe.run(container, { rules });
  if (violations.length > 0) {
    const list = violations.map(
      ({ id, nodes }) => `- ${id}: ${nodes.map((node) => node.html).join(' | ')}`,
    );
    throw new Error(`Violações de acessibilidade (axe):\n${list.join('\n')}`);
  }
}
