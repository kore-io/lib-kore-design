// Regra das classes no JSX (decisões 131 e 148), em JS puro para servir ao ESLint do
// lib-kore-design e do web-kore-app.

/** BEM com o prefixo kore-: kore-<bloco>(__<elemento>)?(--<modificador>)?, minúsculas. */
const SEMANTIC_CLASS =
  /^kore-[a-z0-9]+(?:-[a-z0-9]+)*(?:__[a-z0-9]+(?:-[a-z0-9]+)*)?(?:--[a-z0-9]+(?:-[a-z0-9]+)*)?$/;

/**
 * Marca o lugar de uma expressão num template literal. Sozinha, é uma classe inteira
 * dinâmica (ex.: o className repassado), que não dá para checar; dentro de uma classe
 * (`kore-button--${variant}`), conta como trecho válido.
 */
export const DYNAMIC_PART = '\u0001';

/**
 * Classes fora do padrão numa lista de classes (separadas por espaço).
 * @param {{ classes: string }} options
 * @returns {string[]}
 */
export function findNonSemanticClasses({ classes }) {
  return classes
    .trim()
    .split(/\s+/)
    .filter((name) => name && name !== DYNAMIC_PART)
    .filter((name) => !SEMANTIC_CLASS.test(name.replaceAll(DYNAMIC_PART, 'x')))
    .map((name) => name.replaceAll(DYNAMIC_PART, '${…}'));
}
