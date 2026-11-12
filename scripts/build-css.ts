import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildComponentsCss, listComponentStyles } from '../src/css/components-css';
import { buildTailwindCss } from '../src/css/tailwind-css';
import { buildTokensCss } from '../src/css/tokens-css';

mkdirSync('dist', { recursive: true });
writeFileSync('dist/tokens.css', buildTokensCss());
writeFileSync('dist/tailwind.css', buildTailwindCss());
writeFileSync(
  'dist/components.css',
  await buildComponentsCss({
    files: listComponentStyles({ root: 'src/components' }),
    presetPath: resolve('dist/tailwind.css'),
  }),
);
