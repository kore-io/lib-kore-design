import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import kore from './eslint/index.js';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', '.maestri'] },
  js.configs.recommended,
  ...tseslint.configs.strict,
  {
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: ['**/*.tsx'],
    ...reactHooks.configs.flat.recommended,
    languageOptions: { globals: { ...globals.browser } },
  },
  {
    // Decisões 131 e 148: no JSX, só classes semânticas BEM com o prefixo kore-.
    files: ['src/**/*.tsx'],
    ignores: ['**/*.test.tsx'],
    plugins: { kore },
    rules: { 'kore/semantic-class-names': 'error' },
  },
);
