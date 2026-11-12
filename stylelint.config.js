export default {
  plugins: ['./stylelint/index.js'],
  // As fixtures inválidas violam as regras de propósito (testes do plugin e do build).
  ignoreFiles: ['tests/fixtures/**'],
  rules: {
    'kore/apply-ds-only': true,
    'kore/declaration-ds-only': true,
    'kore/at-rule-ds-only': true,
  },
};
