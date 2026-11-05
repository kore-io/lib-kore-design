// Plugin do ESLint com a regra das classes semânticas (decisões 131 e 148).
// Uso: import kore from '@kore-io/design/eslint'; plugins: { kore },
// rules: { 'kore/semantic-class-names': 'error' }.
import { DYNAMIC_PART, findNonSemanticClasses } from './rules.js';

/**
 * O que a regra lê de um nó da AST (ESTree + JSX).
 * @typedef {{
 *   type: string;
 *   value?: unknown;
 *   quasis?: { value: { cooked: string } }[];
 *   expressions?: unknown[];
 *   expression?: AstNode;
 *   right?: AstNode;
 *   consequent?: AstNode;
 *   alternate?: AstNode;
 *   elements?: (AstNode | null)[];
 * }} AstNode
 */

/**
 * Texto estático de uma expressão de classe; as partes dinâmicas viram DYNAMIC_PART.
 * @param {AstNode | null | undefined} node
 * @returns {string[]}
 */
function staticTexts(node) {
  if (!node) return [];
  switch (node.type) {
    case 'Literal':
      return typeof node.value === 'string' ? [node.value] : [];
    case 'TemplateLiteral': {
      const quasis = node.quasis ?? [];
      const expressions = node.expressions ?? [];
      return [
        quasis
          .map(
            (quasi, index) => quasi.value.cooked + (index < expressions.length ? DYNAMIC_PART : ''),
          )
          .join(''),
      ];
    }
    case 'JSXExpressionContainer':
      return staticTexts(node.expression);
    case 'LogicalExpression':
      return staticTexts(node.right);
    case 'ConditionalExpression':
      return [...staticTexts(node.consequent), ...staticTexts(node.alternate)];
    case 'ArrayExpression':
      return (node.elements ?? []).flatMap((element) => staticTexts(element));
    default:
      return [];
  }
}

/** @type {import('eslint').Rule.RuleModule} */
const semanticClassNames = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'No JSX, só classes semânticas BEM com o prefixo kore- (nada de utilitária do Tailwind).',
    },
    schema: [],
    messages: {
      rejected:
        '"{{name}}" não é classe semântica (kore-<bloco>__<elemento>--<modificador>); o estilo vai no CSS com @apply (decisões 131 e 148).',
    },
  },
  create(context) {
    /** @param {any} node */
    function check(node) {
      for (const text of staticTexts(node)) {
        for (const name of findNonSemanticClasses({ classes: text })) {
          context.report({ node, messageId: 'rejected', data: { name } });
        }
      }
    }
    return {
      /** @param {any} node */
      JSXAttribute(node) {
        if (node.name.name === 'className') check(node.value);
      },
      // joinClassNames({ names: [...] })
      /** @param {any} node */
      'CallExpression[callee.name="joinClassNames"] > ObjectExpression > Property[key.name="names"]'(
        node,
      ) {
        check(node.value);
      },
    };
  },
};

export default {
  meta: { name: '@kore-io/design/eslint' },
  rules: { 'semantic-class-names': semanticClassNames },
};
