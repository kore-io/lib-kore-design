// Regras do CSS de componente (decisões 131 e 133), em JS puro para servir ao
// Stylelint (editor, lint e CI) e ao build do components.css.

/** Só variáveis do DS valem: `var(--kore-*)`, `var(--site-*)`, `bg-(--kore-*)`. */
const DS_VARIABLE = /^--(kore|site)-[\w-]+$/;

/**
 * Propriedades sem utilitária equivalente no Tailwind, únicas aceitas como
 * declaração direta. Entra propriedade nova por PR, com revisão.
 */
export const DIRECT_PROPERTIES = new Set([
  '-webkit-appearance',
  '-webkit-tap-highlight-color',
  '-webkit-text-size-adjust',
  'text-size-adjust',
  'text-rendering',
  'grid-area',
  'counter-reset',
  'counter-increment',
  'hanging-punctuation',
]);

/**
 * At-rules aceitas no CSS de componente. As demais (`@import`, `@theme`, `@utility`,
 * `@plugin`, `@config`, `@source`, `@tailwind`, `@layer`…) furariam as regras: trariam
 * CSS de fora ou mexeriam no tema.
 */
export const ALLOWED_AT_RULES = new Set(['apply', 'media', 'supports', 'container', 'keyframes']);

/** Cores nomeadas do CSS: são palavras, mas são cor literal. */
const NAMED_COLORS = new Set(
  (
    'aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue ' +
    'blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk ' +
    'crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki ' +
    'darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen ' +
    'darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue ' +
    'dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite ' +
    'gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki ' +
    'lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan ' +
    'lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen ' +
    'lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen ' +
    'magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen ' +
    'mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream ' +
    'mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid ' +
    'palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum ' +
    'powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown ' +
    'seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen ' +
    'steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen'
  ).split(' '),
);

const KEYWORD = /^-?[a-z][a-z0-9-]*$/i;
const VAR = /^var\(\s*([^,)\s]+)\s*\)$/;

/**
 * Motivo da recusa de uma at-rule, ou `null` se ela vale.
 * @param {{ name: string }} options
 * @returns {string | null}
 */
export function findAtRuleViolation({ name }) {
  // Exige minúsculas: `@APPLY` o Tailwind ignora, e o estilo sumiria sem aviso.
  if (ALLOWED_AT_RULES.has(name)) return null;
  const allowed = [...ALLOWED_AT_RULES].map((rule) => `@${rule}`).join(', ');
  return `"@${name}" não é aceita no CSS de componente (só ${allowed})`;
}

/**
 * Candidatos do `@apply` que contornam o DS: valor ou variante arbitrária
 * (`bg-[#f00]`, `[&>svg]:p-2`) e variável que não seja `--kore-*`/`--site-*`.
 * @param {{ params: string }} options
 * @returns {string[]}
 */
export function findApplyViolations({ params }) {
  return params
    .trim()
    .split(/\s+/)
    .filter((candidate) => {
      if (candidate.includes('[')) return true;
      const variables = [...candidate.matchAll(/\(([^)]*)\)/g)].map(([, inner = '']) => inner);
      return variables.some((variable) => !DS_VARIABLE.test(variable));
    });
}

/**
 * Motivo da recusa de uma declaração direta (fora do `@apply`), ou `null` se ela
 * vale: propriedade sem utilitária equivalente e valor só com palavras ou
 * `var(--kore-*|--site-*)`. Recusa cor literal, número com ou sem unidade e
 * `var()` fora do DS.
 * @param {{ property: string; value: string }} options
 * @returns {string | null}
 */
export function findDeclarationViolation({ property, value }) {
  const name = property.toLowerCase();
  if (!DIRECT_PROPERTIES.has(name)) {
    return `"${property}" tem utilitária no Tailwind (ou não está liberada): use @apply`;
  }
  for (const token of value.split(/[\s,]+/).filter(Boolean)) {
    const variable = VAR.exec(token);
    if (variable) {
      if (!DS_VARIABLE.test(variable[1] ?? '')) {
        return `"${token}": só var(--kore-*) ou var(--site-*)`;
      }
      continue;
    }
    if (!KEYWORD.test(token)) return `"${token}": só palavra-chave ou variável do DS`;
    if (NAMED_COLORS.has(token.toLowerCase())) return `"${token}": cor literal`;
  }
  return null;
}
