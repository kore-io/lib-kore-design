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
 *   arguments?: AstNode[];
 *   properties?: { value?: AstNode }[];
 *   name?: string;
 * }} AstNode
 */

/**
 * Texto estático de uma expressão de classe; as partes dinâmicas viram DYNAMIC_PART.
 * `resolve` devolve a expressão que inicializa uma constante do escopo, se houver.
 * @param {AstNode | null | undefined} node
 * @param {(identifier: AstNode) => AstNode | null} resolve
 * @param {Set<AstNode>} [seen]
 * @returns {string[]}
 */
function staticTexts(node, resolve, seen = new Set()) {
  if (!node || seen.has(node)) return [];
  seen.add(node);
  const texts = (/** @type {AstNode | null | undefined} */ child) =>
    staticTexts(child, resolve, seen);
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
        // Literais dentro do ${} também são classes (ex.: `kore-card ${'mt-2'}`).
        ...expressions.flatMap((expression) => texts(/** @type {AstNode} */ (expression))),
      ];
    }
    case 'JSXExpressionContainer':
      return texts(node.expression);
    case 'LogicalExpression':
      return texts(node.right);
    case 'ConditionalExpression':
      return [...texts(node.consequent), ...texts(node.alternate)];
    case 'ArrayExpression':
      return (node.elements ?? []).flatMap((element) => texts(element));
    // Qualquer função de classes (joinClassNames, clsx…): os argumentos literais contam.
    case 'CallExpression':
      return (node.arguments ?? []).flatMap((argument) => texts(argument));
    case 'ObjectExpression':
      return (node.properties ?? []).flatMap((property) => texts(property.value));
    // Constante do escopo com valor literal (ex.: const cls = 'flex').
    case 'Identifier':
      return texts(resolve(node));
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
    /**
     * Valor inicial da constante que o identificador referencia, no escopo do uso.
     * @param {any} identifier
     * @returns {AstNode | null}
     */
    function resolve(identifier) {
      let scope = context.sourceCode.getScope(identifier);
      while (scope) {
        const variable = scope.set.get(identifier.name);
        if (variable) {
          const definition = variable.defs[0];
          const declaration = definition?.parent;
          const isConst =
            definition?.type === 'Variable' &&
            declaration?.type === 'VariableDeclaration' &&
            declaration.kind === 'const';
          return isConst ? /** @type {AstNode | null} */ (definition.node.init ?? null) : null;
        }
        scope = /** @type {any} */ (scope.upper);
      }
      return null;
    }

    /** @param {any} node */
    function check(node) {
      for (const text of staticTexts(node, resolve)) {
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
