import axe from 'axe-core';

/**
 * Roda o axe-core no elemento e falha com a lista das violações. A regra de
 * contraste fica de fora: o jsdom não calcula estilo, e o contraste dos tokens
 * é coberto em tests/contrast.test.ts.
 */
export async function expectNoA11yViolations({ container }: { container: Element }) {
  const { violations } = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false } },
  });
  if (violations.length > 0) {
    const list = violations.map(
      ({ id, nodes }) => `- ${id}: ${nodes.map((node) => node.html).join(' | ')}`,
    );
    throw new Error(`Violações de acessibilidade (axe):\n${list.join('\n')}`);
  }
}
